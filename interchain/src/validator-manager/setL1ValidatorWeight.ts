import { utils } from "@avalabs/avalanchejs";
import {
    decodeEventLog,
    encodeFunctionData,
    type Address,
    type Hex,
    type PublicClient,
    type TransactionReceipt,
    type WalletClient,
} from "viem";

import { newL1ValidatorWeightMessage } from "../warp/addressedCallMessages/l1ValidatorWeightMessage.js";
import { parseAddressedCallPayload } from "../warp/addressedCallPayload.js";
import { P_CHAIN_BLOCKCHAIN_ID } from "../warp/constants.js";
import { extractWarpMessageFromReceipt, packWarpIntoAccessList } from "../warp/evm.js";
import { newWarpMessage } from "../warp/newWarpMessage.js";
import { parseWarpUnsignedMessage } from "../warp/warpUnsignedMessage.js";
import { ValidatorManagerAbi } from "./artifacts/ValidatorManager.js";
import { assertSuccessOrReplay, base58checkToBytes32Hex } from "./evmHelpers.js";
import type { AggregateSignaturesFn } from "./initializeValidatorSet.js";

/**
 * Callback that submits the P-Chain `SetL1ValidatorWeightTx` carrying the
 * L1-signed warp message and waits for commitment.
 *
 * Used for both validator weight updates (newWeight > 0) AND removals
 * (newWeight = 0) — the avalanchego tx type is the same; only the inner
 * warp message's `weight` field differs.
 */
export type SubmitPChainSetWeightTxFn = (input: {
    signedWarpMessageHex: Hex;
}) => Promise<{ txId: string }>;

// ---------------------------------------------------------------------------
// Step 1 — EVM initiate
// ---------------------------------------------------------------------------

export interface InitiateValidatorWeightUpdateArgs {
    validatorManagerAddress: Address;
    validationID: Hex;
    newWeight: bigint;
}

export interface InitiateValidatorWeightUpdateResult {
    txHash: Hex;
    receipt: TransactionReceipt;
    /** Monotonic nonce emitted with the weight-update message — required for the P-Chain ACK to match. */
    nonce: bigint;
    /** Full unsigned warp message bytes from the warp precompile `SendWarpMessage` event. */
    unsignedWarpMessageHex: Hex;
    /** Inner AddressedCall payload (= L1ValidatorWeightMessage body bytes). */
    addressedCallPayloadHex: Hex;
}

/**
 * Call `ValidatorManager.initiateValidatorWeightUpdate(validationID, newWeight)`,
 * wait for the receipt, and extract the unsigned warp message + nonce.
 */
export async function initiateValidatorWeightUpdate(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: InitiateValidatorWeightUpdateArgs,
): Promise<InitiateValidatorWeightUpdateResult> {
    const fnArgs = [args.validationID, args.newWeight] as const;

    const txHash = await walletClient.writeContract({
        address: args.validatorManagerAddress,
        abi: ValidatorManagerAbi,
        functionName: "initiateValidatorWeightUpdate",
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
            functionName: "initiateValidatorWeightUpdate",
            args: fnArgs,
        }),
        ...(walletClient.account ? { account: walletClient.account } : {}),
        opName: "initiateValidatorWeightUpdate",
    });

    const nonce = decodeInitiatedWeightUpdateEvent(receipt);
    const unsignedWarpMessageHex = extractWarpMessageFromReceipt(receipt);
    const unsignedMessage = parseWarpUnsignedMessage(unsignedWarpMessageHex);
    const addressedCallPayloadHex = `0x${parseAddressedCallPayload(
        unsignedMessage.payload.toString("hex"),
    ).payload.toString("hex")}` as Hex;

    return { txHash, receipt, nonce, unsignedWarpMessageHex, addressedCallPayloadHex };
}

function decodeInitiatedWeightUpdateEvent(receipt: TransactionReceipt): bigint {
    for (const log of receipt.logs) {
        try {
            const decoded = decodeEventLog({
                abi: ValidatorManagerAbi,
                data: log.data,
                topics: log.topics,
                strict: false,
            });
            if (decoded.eventName === "InitiatedValidatorWeightUpdate") {
                return (decoded.args as { nonce: bigint }).nonce;
            }
        } catch {
            // Non-VM event (e.g. the warp precompile's SendWarpMessage) — skip.
        }
    }
    throw new Error(
        "initiateValidatorWeightUpdate succeeded but no InitiatedValidatorWeightUpdate event present in receipt logs",
    );
}

// ---------------------------------------------------------------------------
// Step 5 — EVM complete
// ---------------------------------------------------------------------------

export interface CompleteValidatorWeightUpdateArgs {
    validatorManagerAddress: Address;
    signedAckMessageHex: Hex;
}

export interface CompleteValidatorWeightUpdateResult {
    txHash: Hex;
    receipt: TransactionReceipt;
}

export async function completeValidatorWeightUpdate(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: CompleteValidatorWeightUpdateArgs,
): Promise<CompleteValidatorWeightUpdateResult> {
    const accessList = packWarpIntoAccessList(utils.hexToBuffer(args.signedAckMessageHex));
    const callData = encodeFunctionData({
        abi: ValidatorManagerAbi,
        functionName: "completeValidatorWeightUpdate",
        args: [0],
    });

    try {
        await publicClient.simulateContract({
            address: args.validatorManagerAddress,
            abi: ValidatorManagerAbi,
            functionName: "completeValidatorWeightUpdate",
            args: [0],
            accessList,
            account: walletClient.account ?? undefined,
        } as never);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`completeValidatorWeightUpdate would revert: ${msg}`);
    }

    const txHash = await walletClient.writeContract({
        address: args.validatorManagerAddress,
        abi: ValidatorManagerAbi,
        functionName: "completeValidatorWeightUpdate",
        args: [0],
        accessList,
        chain: walletClient.chain,
        account: walletClient.account ?? null,
    } as never);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log(
        `[completeValidatorWeightUpdate] receipt status=${receipt.status} gasUsed=${receipt.gasUsed} logs=${receipt.logs.length}`,
    );

    await assertSuccessOrReplay(publicClient, {
        receipt,
        contractAddress: args.validatorManagerAddress,
        callData,
        accessList,
        ...(walletClient.account ? { account: walletClient.account } : {}),
        opName: "completeValidatorWeightUpdate",
    });

    return { txHash, receipt };
}

// ---------------------------------------------------------------------------
// Top-level orchestrator
// ---------------------------------------------------------------------------

export interface SetL1ValidatorWeightArgs {
    validatorManagerAddress: Address;
    networkId: number;
    /** Subnet ID (base58check) — signing-subnet for both warp aggregations. */
    subnetId: string;
    /** 32-byte validation ID of the validator whose weight is being updated. */
    validationID: Hex;
    /** New weight to set. Use `0n` to remove the validator (prefer the dedicated removal flow). */
    newWeight: bigint;
    aggregateSignatures: AggregateSignaturesFn;
    submitPChainSetWeightTx: SubmitPChainSetWeightTxFn;
}

export interface SetL1ValidatorWeightResult {
    nonce: bigint;
    initiateTxHash: Hex;
    pChainSetWeightTxId: string;
    completeTxHash: Hex;
    signedWeightUpdateMessageHex: Hex;
    signedWeightUpdateAckHex: Hex;
}

/**
 * End-to-end weight-update flow for an L1 validator.
 *
 * Phases:
 *   1. EVM   `initiateValidatorWeightUpdate(validationID, newWeight)` →
 *            unsigned `L1ValidatorWeightMessage(validationID, nonce, newWeight)`.
 *   2. Sigagg L1-subnet signatures on it.
 *   3. Caller submits `SetL1ValidatorWeightTx` on the P-Chain.
 *   4. Build `L1ValidatorWeightMessage(validationID, nonce, newWeight)` as an
 *            ACK unsigned warp message (P-Chain as source, system-source
 *            AddressedCall).
 *   5. Sigagg L1-subnet signatures on the ACK. Justification = the 32-byte
 *            validation ID (avalanchego's `verifyL1ValidatorWeight` uses
 *            `ids.ToID(justification)` then looks up
 *            `state.GetL1Validator(validationID)` to confirm the message
 *            matches current P-Chain state). Signing subnet is the L1 (NOT
 *            primary network) — see comment in registerL1Validator.ts.
 *   6. EVM   `completeValidatorWeightUpdate(0)`.
 */
export async function setL1ValidatorWeight(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: SetL1ValidatorWeightArgs,
): Promise<SetL1ValidatorWeightResult> {
    const initiate = await initiateValidatorWeightUpdate(walletClient, publicClient, {
        validatorManagerAddress: args.validatorManagerAddress,
        validationID: args.validationID,
        newWeight: args.newWeight,
    });

    const signedWeightUpdateMessageHex = await args.aggregateSignatures({
        unsignedMessageHex: initiate.unsignedWarpMessageHex,
        signingSubnetId: args.subnetId,
        justificationHex: "0x" as Hex,
    });

    const { txId: pChainSetWeightTxId } = await args.submitPChainSetWeightTx({
        signedWarpMessageHex: signedWeightUpdateMessageHex,
    });

    // Build the L1ValidatorWeightMessage(validationID, nonce, newWeight) ACK
    // with P-Chain as source. The validationID base58check form is what
    // newL1ValidatorWeightMessage expects.
    const validationIdB58 = utils.base58check.encode(utils.hexToBuffer(args.validationID));
    const ackPayloadHex = newL1ValidatorWeightMessage(
        validationIdB58,
        initiate.nonce,
        args.newWeight,
    ).toHex() as Hex;
    const ackUnsignedHex = newWarpMessage(
        args.networkId,
        P_CHAIN_BLOCKCHAIN_ID,
        "",
        ackPayloadHex,
    ).toHex() as Hex;

    const signedWeightUpdateAckHex = await args.aggregateSignatures({
        unsignedMessageHex: ackUnsignedHex,
        signingSubnetId: args.subnetId,
        justificationHex: base58checkToBytes32Hex(validationIdB58),
    });

    const complete = await completeValidatorWeightUpdate(walletClient, publicClient, {
        validatorManagerAddress: args.validatorManagerAddress,
        signedAckMessageHex: signedWeightUpdateAckHex,
    });

    return {
        nonce: initiate.nonce,
        initiateTxHash: initiate.txHash,
        pChainSetWeightTxId,
        completeTxHash: complete.txHash,
        signedWeightUpdateMessageHex,
        signedWeightUpdateAckHex,
    };
}
