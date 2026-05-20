import { utils } from "@avalabs/avalanchejs";
import {
    bytesToHex,
    decodeEventLog,
    encodeFunctionData,
    type Address,
    type Hex,
    type TransactionReceipt,
} from "viem";

import { newL1ValidatorRegistrationMessage } from "../warp/addressedCallMessages/l1ValidatorRegistrationMessage.js";
import { parseAddressedCallPayload } from "../warp/addressedCallPayload.js";
import { P_CHAIN_BLOCKCHAIN_ID } from "../warp/constants.js";
import { extractWarpMessageFromReceipt, packWarpIntoAccessList } from "../warp/evm.js";
import { newWarpMessage } from "../warp/newWarpMessage.js";
import { nodeIdToBytes } from "../warp/utils.js";
import { parseWarpUnsignedMessage } from "../warp/warpUnsignedMessage.js";
import { ValidatorManagerAbi } from "./artifacts/ValidatorManager.js";
import { assertSuccessOrReplay } from "./evmHelpers.js";
import type { AggregateSignaturesFn } from "./initializeValidatorSet.js";
import type { MinimalWalletClient, MinimalPublicClient } from "./clientTypes.js";
import type { OnProgress } from "./types.js";

/**
 * P-Chain owner shape on the EVM ABI: a `{ threshold, address[] }` tuple.
 * The address[] entries are 20-byte hashes corresponding to bech32 P-Chain
 * addresses — same length as EVM addresses, so viem accepts them as `0x…`.
 */
export interface EvmPChainOwner {
    threshold: number;
    addresses: readonly Address[];
}

/** Inputs that describe the validator being registered. */
export interface RegisterValidatorParams {
    /** Node ID — any of NodeID-<b58c>, b58c, or 0x-hex. */
    nodeId: string;
    /** Validator's compressed BLS G1 public key (48 bytes), 0x-hex. */
    blsPublicKey: Hex;
    /** Initial weight assigned to the validator on the L1. */
    weight: bigint;
    remainingBalanceOwner: EvmPChainOwner;
    disableOwner: EvmPChainOwner;
}

/**
 * Callback that returns the validator's 96-byte BLS *proof of possession*
 * (BLS signature over its own compressed public key with the PoP DST), 0x-hex.
 *
 * The P-Chain `RegisterL1ValidatorTx.ProofOfPossession` field — fed via
 * `prepareRegisterL1ValidatorTxn`'s `blsSignature` parameter — is verified
 * against `msg.BLSPublicKey` (from the RegisterL1ValidatorMessage payload)
 * with `signer.ProofOfPossession.Verify`, which delegates to
 * `bls.VerifyProofOfPossession(pk, sig, pk)`. It is NOT a signature over the
 * AddressedCall payload — see avalanchego
 * `vms/platformvm/txs/executor/standard_tx_executor.go::RegisterL1ValidatorTx`.
 */
export type GetBlsProofOfPossessionFn = () => Promise<Hex>;

/**
 * Callback that submits the P-Chain `RegisterL1ValidatorTx` carrying the
 * L1-signed warp message and the validator's BLS signature, waits for
 * commitment, and returns the tx ID.
 *
 * Caller owns the P-Chain wallet (kept out of this package so interchain
 * doesn't need to know about `@avalanche-sdk/client`'s wallet types).
 */
export type SubmitPChainRegisterTxFn = (input: {
    signedWarpMessageHex: Hex;
    blsProofOfPossessionHex: Hex;
}) => Promise<{ txId: string }>;

// ---------------------------------------------------------------------------
// Step 1 — EVM initiate
// ---------------------------------------------------------------------------

export interface InitiateValidatorRegistrationArgs {
    validatorManagerAddress: Address;
    validator: RegisterValidatorParams;
}

export interface InitiateValidatorRegistrationResult {
    txHash: Hex;
    receipt: TransactionReceipt;
    /** 32-byte validation ID emitted in `InitiatedValidatorRegistration`. */
    validationID: Hex;
    /** Full unsigned warp message bytes (codec + envelope + payload). */
    unsignedWarpMessageHex: Hex;
    /** Inner AddressedCall payload (= RegisterL1ValidatorMessage body bytes). */
    addressedCallPayloadHex: Hex;
    /** Registration expiry timestamp (uint64) emitted in the event. */
    registrationExpiry: bigint;
}

/**
 * Call `ValidatorManager.initiateValidatorRegistration(...)`, wait for the
 * receipt, and extract everything the next steps will need:
 *   - validationID + registrationExpiry from `InitiatedValidatorRegistration`
 *   - the unsigned warp message + inner AddressedCall payload from the warp
 *     precompile's `SendWarpMessage` event
 */
export async function initiateValidatorRegistration(
    walletClient: MinimalWalletClient,
    publicClient: MinimalPublicClient,
    args: InitiateValidatorRegistrationArgs,
): Promise<InitiateValidatorRegistrationResult> {
    const nodeIdHex = bytesToHex(nodeIdToBytes(args.validator.nodeId));
    const fnArgs = [
        nodeIdHex,
        args.validator.blsPublicKey,
        args.validator.remainingBalanceOwner,
        args.validator.disableOwner,
        args.validator.weight,
    ] as const;

    const txHash = await walletClient.writeContract({
        address: args.validatorManagerAddress,
        abi: ValidatorManagerAbi,
        functionName: "initiateValidatorRegistration",
        args: fnArgs,
        chain: walletClient.chain,
        account: walletClient.account ?? null,
    } as never);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    await assertSuccessOrReplay(publicClient, {
        receipt,
        contractAddress: args.validatorManagerAddress,
        callData: encodeFunctionData({
            abi: ValidatorManagerAbi,
            functionName: "initiateValidatorRegistration",
            args: fnArgs,
        }),
        ...(walletClient.account ? { account: walletClient.account } : {}),
        opName: "initiateValidatorRegistration",
    });

    const { validationID, registrationExpiry } = decodeInitiatedRegistrationEvent(receipt);

    const unsignedWarpMessageHex = extractWarpMessageFromReceipt(receipt);
    const unsignedMessage = parseWarpUnsignedMessage(unsignedWarpMessageHex);
    const addressedCallPayloadHex = `0x${parseAddressedCallPayload(
        unsignedMessage.payload.toString("hex"),
    ).payload.toString("hex")}` as Hex;

    return {
        txHash,
        receipt,
        validationID,
        unsignedWarpMessageHex,
        addressedCallPayloadHex,
        registrationExpiry,
    };
}

function decodeInitiatedRegistrationEvent(receipt: TransactionReceipt): {
    validationID: Hex;
    registrationExpiry: bigint;
} {
    for (const log of receipt.logs) {
        try {
            const decoded = decodeEventLog({
                abi: ValidatorManagerAbi,
                data: log.data,
                topics: log.topics,
                strict: false,
            });
            if (decoded.eventName === "InitiatedValidatorRegistration") {
                const a = decoded.args as {
                    validationID: Hex;
                    registrationExpiry: bigint;
                };
                return { validationID: a.validationID, registrationExpiry: a.registrationExpiry };
            }
        } catch {
            // Non-VM event (e.g. the warp precompile's SendWarpMessage) — skip.
        }
    }
    throw new Error(
        "initiateValidatorRegistration succeeded but no InitiatedValidatorRegistration event present in receipt logs",
    );
}

// ---------------------------------------------------------------------------
// Step 5 — EVM complete
// ---------------------------------------------------------------------------

export interface CompleteValidatorRegistrationArgs {
    validatorManagerAddress: Address;
    /** Aggregated signed `L1ValidatorRegistrationMessage(validationID, true)` warp message. */
    signedAckMessageHex: Hex;
    /** Optional progress callback. See {@link OnProgress}. */
    onProgress?: OnProgress;
}

export interface CompleteValidatorRegistrationResult {
    txHash: Hex;
    receipt: TransactionReceipt;
}

/**
 * Call `ValidatorManager.completeValidatorRegistration(messageIndex=0)` with
 * the signed P-Chain ACK message packed into the warp-precompile access list.
 */
export async function completeValidatorRegistration(
    walletClient: MinimalWalletClient,
    publicClient: MinimalPublicClient,
    args: CompleteValidatorRegistrationArgs,
): Promise<CompleteValidatorRegistrationResult> {
    const accessList = packWarpIntoAccessList(utils.hexToBuffer(args.signedAckMessageHex));

    const callData = encodeFunctionData({
        abi: ValidatorManagerAbi,
        functionName: "completeValidatorRegistration",
        args: [0],
    });

    // Pre-flight via simulateContract so any revert (including warp-precompile
    // predicate failures) surfaces with the abi-decoded reason before we burn
    // gas committing the tx.
    try {
        await publicClient.simulateContract({
            address: args.validatorManagerAddress,
            abi: ValidatorManagerAbi,
            functionName: "completeValidatorRegistration",
            args: [0],
            accessList,
            account: walletClient.account ?? undefined,
        } as never);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`completeValidatorRegistration would revert: ${msg}`);
    }

    const txHash = await walletClient.writeContract({
        address: args.validatorManagerAddress,
        abi: ValidatorManagerAbi,
        functionName: "completeValidatorRegistration",
        args: [0],
        accessList,
        chain: walletClient.chain,
        account: walletClient.account ?? null,
    } as never);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    args.onProgress?.(
        `[completeValidatorRegistration] receipt status=${receipt.status} gasUsed=${receipt.gasUsed} logs=${receipt.logs.length}`,
    );

    await assertSuccessOrReplay(publicClient, {
        receipt,
        contractAddress: args.validatorManagerAddress,
        callData,
        accessList,
        ...(walletClient.account ? { account: walletClient.account } : {}),
        opName: "completeValidatorRegistration",
    });

    return { txHash, receipt };
}

// ---------------------------------------------------------------------------
// Top-level orchestrator
// ---------------------------------------------------------------------------

export interface RegisterL1ValidatorArgs {
    validatorManagerAddress: Address;
    /** Avalanche network ID (1 mainnet, 5 fuji, 12345 local). */
    networkId: number;
    /** Subnet ID (base58check) — used as signing-subnet for the L1-signed warp message. */
    subnetId: string;
    validator: RegisterValidatorParams;
    aggregateSignatures: AggregateSignaturesFn;
    getBlsProofOfPossession: GetBlsProofOfPossessionFn;
    submitPChainRegisterTx: SubmitPChainRegisterTxFn;
    /** Optional progress callback. See {@link OnProgress}. */
    onProgress?: OnProgress;
}

export interface RegisterL1ValidatorResult {
    validationID: Hex;
    initiateTxHash: Hex;
    pChainRegisterTxId: string;
    completeTxHash: Hex;
    /** L1-signed `RegisterL1ValidatorMessage` warp message (the message that went into the P-Chain tx). */
    signedRegistrationMessageHex: Hex;
    /** L1-signed `L1ValidatorRegistrationMessage` ACK (the message that went into completeValidatorRegistration). */
    signedRegistrationAckHex: Hex;
    /**
     * Inner `RegisterL1ValidatorMessage` payload bytes (codec + typeID + body).
     * Preserve these — `disableL1Validator` needs them as the justification when
     * asking L1 validators to sign the `L1ValidatorRegistrationMessage(false)` ACK.
     */
    registerMessagePayloadHex: Hex;
}

/**
 * End-to-end register-validator flow on an L1 wired up with ACP-77.
 *
 * Phases:
 *   1. EVM   `initiateValidatorRegistration(...)` → unsigned warp message
 *            (`RegisterL1ValidatorMessage`) + validationID + AddressedCall payload.
 *   2. Sigagg L1 signatures on the unsigned warp message (signingSubnetId =
 *            subnetId, no justification).
 *   3. Caller produces the validator's BLS proof-of-possession (we don't own
 *            the key here — the validator's operator does).
 *   4. Caller submits `RegisterL1ValidatorTx` on the P-Chain carrying both
 *            the L1-signed warp message and the BLS PoP.
 *   5. Build `L1ValidatorRegistrationMessage(validationID, registered=true)`
 *            unsigned warp message (P-Chain as source, system source).
 *   6. Sigagg L1-subnet signatures on it. Justification = the
 *            RegisterL1ValidatorMessage payload bytes (sha256 of which IS
 *            the validation ID; avalanchego's
 *            `verifyL1ValidatorRegistration` uses it to look up the
 *            validator on its P-Chain state).
 *
 *            NOTE on signer set: subnet-evm's warp predicate
 *            (`precompile/contracts/warp/config.go::VerifyPredicate`) always
 *            falls through to the L1's own subnet validators for P-Chain-
 *            sourced messages (it explicitly bypasses `RequirePrimaryNetworkSigners`
 *            when `SourceChainID == PlatformChainID`, on the grounds that the
 *            P-chain is "always synced"). Signing here with primary network
 *            would cause the L1's `completeValidatorRegistration` to revert
 *            with `InvalidWarpMessage()`.
 *   7. EVM   `completeValidatorRegistration(0)` with the signed ACK in the
 *            warp-precompile access list.
 */
export async function registerL1Validator(
    walletClient: MinimalWalletClient,
    publicClient: MinimalPublicClient,
    args: RegisterL1ValidatorArgs,
): Promise<RegisterL1ValidatorResult> {
    // 1. Initiate on EVM.
    const initiate = await initiateValidatorRegistration(walletClient, publicClient, {
        validatorManagerAddress: args.validatorManagerAddress,
        validator: args.validator,
    });

    // 2. L1 sigs over the outgoing RegisterL1ValidatorMessage.
    const signedRegistrationMessageHex = await args.aggregateSignatures({
        unsignedMessageHex: initiate.unsignedWarpMessageHex,
        signingSubnetId: args.subnetId,
        justificationHex: "0x" as Hex,
    });

    // 3. Validator's BLS proof-of-possession (over its own public key).
    const blsProofOfPossessionHex = await args.getBlsProofOfPossession();

    // 4. P-Chain RegisterL1ValidatorTx (caller owns the wallet).
    const { txId: pChainRegisterTxId } = await args.submitPChainRegisterTx({
        signedWarpMessageHex: signedRegistrationMessageHex,
        blsProofOfPossessionHex,
    });

    // 5. Build the L1ValidatorRegistrationMessage(validationID, true) ACK.
    //    P-Chain is the source; AddressedCall has a zero-length system source.
    const validationIdB58 = utils.base58check.encode(utils.hexToBuffer(initiate.validationID));
    const ackPayloadHex = newL1ValidatorRegistrationMessage(validationIdB58, true).toHex() as Hex;
    const ackUnsignedHex = newWarpMessage(
        args.networkId,
        P_CHAIN_BLOCKCHAIN_ID,
        "",
        ackPayloadHex,
    ).toHex() as Hex;

    // 6. L1-subnet sigs on the ACK (see comment above on signer-set choice).
    //    Justification = original RegisterL1ValidatorMessage payload bytes —
    //    each L1 validator hashes those, matches against its P-Chain state
    //    lookup for the validationID, and signs only if it sees the validator
    //    as registered.
    const signedRegistrationAckHex = await args.aggregateSignatures({
        unsignedMessageHex: ackUnsignedHex,
        signingSubnetId: args.subnetId,
        justificationHex: initiate.addressedCallPayloadHex,
    });

    // 7. Complete on EVM.
    const complete = await completeValidatorRegistration(walletClient, publicClient, {
        validatorManagerAddress: args.validatorManagerAddress,
        signedAckMessageHex: signedRegistrationAckHex,
        ...(args.onProgress ? { onProgress: args.onProgress } : {}),
    });

    return {
        validationID: initiate.validationID,
        initiateTxHash: initiate.txHash,
        pChainRegisterTxId,
        completeTxHash: complete.txHash,
        signedRegistrationMessageHex,
        signedRegistrationAckHex,
        registerMessagePayloadHex: initiate.addressedCallPayloadHex,
    };
}
