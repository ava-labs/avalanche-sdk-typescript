import { utils } from "@avalabs/avalanchejs";
import {
    bytesToHex,
    encodeFunctionData,
    hexToBytes,
    type Address,
    type Hex,
    type PublicClient,
    type TransactionReceipt,
    type WalletClient,
} from "viem";

import { newL1ValidatorRegistrationMessage } from "../warp/addressedCallMessages/l1ValidatorRegistrationMessage.js";
import { parseAddressedCallPayload } from "../warp/addressedCallPayload.js";
import { P_CHAIN_BLOCKCHAIN_ID } from "../warp/constants.js";
import { extractWarpMessageFromReceipt, packWarpIntoAccessList } from "../warp/evm.js";
import {
    getRegistrationJustification,
    marshalRegisterMessageJustification,
    type JustificationPublicClient,
} from "../warp/justification.js";
import { newWarpMessage } from "../warp/newWarpMessage.js";
import { parseWarpUnsignedMessage } from "../warp/warpUnsignedMessage.js";
import { ValidatorManagerAbi } from "./artifacts/ValidatorManager.js";
import { assertSuccessOrReplay } from "./evmHelpers.js";
import type { AggregateSignaturesFn } from "./initializeValidatorSet.js";
import type { SubmitPChainSetWeightTxFn } from "./setL1ValidatorWeight.js";

// ---------------------------------------------------------------------------
// Step 1 — EVM initiate
// ---------------------------------------------------------------------------

export interface InitiateValidatorRemovalArgs {
    validatorManagerAddress: Address;
    validationID: Hex;
}

export interface InitiateValidatorRemovalResult {
    txHash: Hex;
    receipt: TransactionReceipt;
    /** Full unsigned warp message bytes (an `L1ValidatorWeightMessage` with weight=0). */
    unsignedWarpMessageHex: Hex;
    /** Inner AddressedCall payload (= L1ValidatorWeightMessage body bytes). */
    addressedCallPayloadHex: Hex;
}

/**
 * Call `ValidatorManager.initiateValidatorRemoval(validationID)`.
 *
 * Under the hood the contract calls `_initiateValidatorWeightUpdate(validationID, 0)`,
 * which emits the same kind of `L1ValidatorWeightMessage` we sign for a
 * regular weight change — only with `weight=0`. The P-Chain interprets that
 * as "remove this validator".
 */
export async function initiateValidatorRemoval(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: InitiateValidatorRemovalArgs,
): Promise<InitiateValidatorRemovalResult> {
    const fnArgs = [args.validationID] as const;

    const txHash = await walletClient.writeContract({
        address: args.validatorManagerAddress,
        abi: ValidatorManagerAbi,
        functionName: "initiateValidatorRemoval",
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
            functionName: "initiateValidatorRemoval",
            args: fnArgs,
        }),
        ...(walletClient.account ? { account: walletClient.account } : {}),
        opName: "initiateValidatorRemoval",
    });

    const unsignedWarpMessageHex = extractWarpMessageFromReceipt(receipt);
    const unsignedMessage = parseWarpUnsignedMessage(unsignedWarpMessageHex);
    const addressedCallPayloadHex = `0x${parseAddressedCallPayload(
        unsignedMessage.payload.toString("hex"),
    ).payload.toString("hex")}` as Hex;

    return { txHash, receipt, unsignedWarpMessageHex, addressedCallPayloadHex };
}

// ---------------------------------------------------------------------------
// Step 5 — EVM complete
// ---------------------------------------------------------------------------

export interface CompleteValidatorRemovalArgs {
    validatorManagerAddress: Address;
    signedAckMessageHex: Hex;
}

export interface CompleteValidatorRemovalResult {
    txHash: Hex;
    receipt: TransactionReceipt;
}

export async function completeValidatorRemoval(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: CompleteValidatorRemovalArgs,
): Promise<CompleteValidatorRemovalResult> {
    const accessList = packWarpIntoAccessList(utils.hexToBuffer(args.signedAckMessageHex));
    const callData = encodeFunctionData({
        abi: ValidatorManagerAbi,
        functionName: "completeValidatorRemoval",
        args: [0],
    });

    try {
        await publicClient.simulateContract({
            address: args.validatorManagerAddress,
            abi: ValidatorManagerAbi,
            functionName: "completeValidatorRemoval",
            args: [0],
            accessList,
            account: walletClient.account ?? undefined,
        } as never);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`completeValidatorRemoval would revert: ${msg}`);
    }

    const txHash = await walletClient.writeContract({
        address: args.validatorManagerAddress,
        abi: ValidatorManagerAbi,
        functionName: "completeValidatorRemoval",
        args: [0],
        accessList,
        chain: walletClient.chain,
        account: walletClient.account ?? null,
    } as never);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log(
        `[completeValidatorRemoval] receipt status=${receipt.status} gasUsed=${receipt.gasUsed} logs=${receipt.logs.length}`,
    );

    await assertSuccessOrReplay(publicClient, {
        receipt,
        contractAddress: args.validatorManagerAddress,
        callData,
        accessList,
        ...(walletClient.account ? { account: walletClient.account } : {}),
        opName: "completeValidatorRemoval",
    });

    return { txHash, receipt };
}

// ---------------------------------------------------------------------------
// Top-level orchestrator
// ---------------------------------------------------------------------------

export interface DisableL1ValidatorArgs {
    validatorManagerAddress: Address;
    networkId: number;
    /** Subnet ID (base58check) — signing-subnet for both warp aggregations. */
    subnetId: string;
    /** 32-byte validation ID of the validator being removed. */
    validationID: Hex;
    /**
     * Optional fast-path override for the removal-ACK justification: the
     * raw `RegisterL1ValidatorMessage` payload bytes captured at register
     * time (the `registerMessagePayloadHex` field of
     * {@link import("./registerL1Validator.js").RegisterL1ValidatorResult}).
     *
     * The SDK passes this as the justification for the
     * `L1ValidatorRegistrationMessage(false)` ACK so L1 validators can
     * verify removal via `verifyL1ValidatorRegistration`. When omitted,
     * we fall back to scanning the L1's warp logs via
     * {@link getRegistrationJustification} (slower; needs to walk back to
     * the `InitiatedValidatorRegistration` block).
     */
    registerMessagePayloadHex?: Hex;
    /**
     * Required when {@link registerMessagePayloadHex} is omitted — used by
     * {@link getRegistrationJustification} to scan the L1's warp logs.
     */
    l1PublicClient?: JustificationPublicClient;
    aggregateSignatures: AggregateSignaturesFn;
    submitPChainSetWeightTx: SubmitPChainSetWeightTxFn;
}

export interface DisableL1ValidatorResult {
    initiateTxHash: Hex;
    pChainSetWeightTxId: string;
    completeTxHash: Hex;
    signedRemovalMessageHex: Hex;
    signedRemovalAckHex: Hex;
}

/**
 * End-to-end remove-validator flow on an L1.
 *
 * Phases (mirrors the register/weight-update shape):
 *   1. EVM   `initiateValidatorRemoval(validationID)` → unsigned
 *            `L1ValidatorWeightMessage(validationID, nonce, weight=0)`.
 *   2. Sigagg L1-subnet signatures on it.
 *   3. Caller submits `SetL1ValidatorWeightTx` on the P-Chain (same tx type
 *            as a regular weight update, just with `weight=0`).
 *   4. Build the ACK as an `L1ValidatorRegistrationMessage(validationID, false)`
 *            unsigned warp message (P-Chain as source, system-source
 *            AddressedCall). Different shape from weight-update ACK because
 *            the contract's `completeValidatorRemoval` expects a
 *            registration-status message, not a weight-update message.
 *   5. Sigagg L1-subnet signatures on the ACK. Justification = the original
 *            `RegisterL1ValidatorMessage` payload bytes.
 *   6. EVM   `completeValidatorRemoval(0)`.
 */
export async function disableL1Validator(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: DisableL1ValidatorArgs,
): Promise<DisableL1ValidatorResult> {
    const initiate = await initiateValidatorRemoval(walletClient, publicClient, {
        validatorManagerAddress: args.validatorManagerAddress,
        validationID: args.validationID,
    });

    const signedRemovalMessageHex = await args.aggregateSignatures({
        unsignedMessageHex: initiate.unsignedWarpMessageHex,
        signingSubnetId: args.subnetId,
        justificationHex: "0x" as Hex,
    });

    const { txId: pChainSetWeightTxId } = await args.submitPChainSetWeightTx({
        signedWarpMessageHex: signedRemovalMessageHex,
    });

    // Build the L1ValidatorRegistrationMessage(validationID, false) ACK.
    const validationIdB58 = utils.base58check.encode(utils.hexToBuffer(args.validationID));
    const ackPayloadHex = newL1ValidatorRegistrationMessage(validationIdB58, false).toHex() as Hex;
    const ackUnsignedHex = newWarpMessage(
        args.networkId,
        P_CHAIN_BLOCKCHAIN_ID,
        "",
        ackPayloadHex,
    ).toHex() as Hex;

    // avalanchego's `verifyL1ValidatorRegistration` for `registered=false`
    // expects the justification to be a protobuf-marshalled
    // `L1ValidatorRegistrationJustification` (either the bootstrap-index
    // form or one wrapping the original `RegisterL1ValidatorMessage` bytes).
    // Raw payload bytes here would be rejected as a parse error and the
    // validator refuses to sign (accumulatedWeight=0 from the sigagg side).
    //
    // Fast path: if the caller preserved the original
    // `RegisterL1ValidatorMessage` payload from register-time (the
    // `registerMessagePayloadHex` field on `RegisterL1ValidatorResult`),
    // wrap it in the field-2 protobuf form directly and skip the warp-log
    // scan entirely.
    //
    // Fallback: derive the protobuf via {@link getRegistrationJustification},
    // which scans the L1's warp logs backwards and reconstructs the wrapper.
    let justificationBytes: Uint8Array | null;
    if (args.registerMessagePayloadHex) {
        console.log(
            "[disableL1Validator] using registerMessagePayloadHex fast path — skipping L1 warp-log scan",
        );
        justificationBytes = marshalRegisterMessageJustification(
            hexToBytes(args.registerMessagePayloadHex),
        );
    } else {
        if (!args.l1PublicClient) {
            throw new Error(
                "disableL1Validator: l1PublicClient is required to derive the removal-ACK justification when registerMessagePayloadHex is not provided (see getRegistrationJustification)",
            );
        }
        console.log(
            "[disableL1Validator] scanning L1 warp logs for register payload (no registerMessagePayloadHex provided)",
        );
        justificationBytes = await getRegistrationJustification(
            args.validationID,
            args.subnetId,
            args.l1PublicClient,
        );
        if (!justificationBytes) {
            throw new Error(
                `disableL1Validator: getRegistrationJustification returned null for validationID ${args.validationID} — register tx not found in the L1's recent warp logs`,
            );
        }
    }
    const signedRemovalAckHex = await args.aggregateSignatures({
        unsignedMessageHex: ackUnsignedHex,
        signingSubnetId: args.subnetId,
        justificationHex: bytesToHex(justificationBytes),
    });

    const complete = await completeValidatorRemoval(walletClient, publicClient, {
        validatorManagerAddress: args.validatorManagerAddress,
        signedAckMessageHex: signedRemovalAckHex,
    });

    return {
        initiateTxHash: initiate.txHash,
        pChainSetWeightTxId,
        completeTxHash: complete.txHash,
        signedRemovalMessageHex,
        signedRemovalAckHex,
    };
}
