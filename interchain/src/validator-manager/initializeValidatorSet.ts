import { utils } from "@avalabs/avalanchejs";
import {
    bytesToHex,
    encodeFunctionData,
    type Address,
    type Hex,
    type PublicClient,
    type TransactionReceipt,
    type WalletClient,
} from "viem";

import { newConversionData } from "../warp/addressedCallMessages/conversionData.js";
import { newSubnetToL1ConversionMessage } from "../warp/addressedCallMessages/subnetToL1ConversionMessage.js";
import { packWarpIntoAccessList } from "../warp/evm.js";
import { newWarpMessage } from "../warp/newWarpMessage.js";
import { readU64 } from "../warp/utils.js";
import { ValidatorManagerAbi } from "./artifacts/ValidatorManager.js";

/** Re-encode a base58check ID as a 0x-prefixed 32-byte hex string. */
function base58checkToBytes32Hex(id: string): Hex {
    return bytesToHex(utils.base58check.decode(id));
}

/** Validator entry passed to {@link initializeValidatorSet}. */
export interface InitialValidator {
    /** NodeID — any of NodeID-<base58check>, base58check, or 0x-prefixed hex. */
    nodeId: string;
    /** Validator weight (unitless; relative). */
    weight: bigint;
    /** BLS public key (compressed G1, 48 bytes), 0x-prefixed hex. */
    blsPublicKey: Hex;
}

/**
 * Callback that aggregates BLS signatures across the L1's bootstrap
 * validators. Typically wraps the `signature-aggregator` binary's
 * `/aggregate-signatures` HTTP endpoint.
 *
 * Implementations:
 *   - input  `unsignedMessageHex` — full warp UnsignedMessage hex
 *            `signingSubnetId` — base58check subnet ID to query for sigs
 *            `justificationHex` — hex-encoded bytes the validator's
 *              verifier uses to look up its local state. For
 *              SubnetToL1Conversion messages this is the 32-byte
 *              subnet ID; without it avalanchego's verifier rejects
 *              the signing request as "failed to parse justification".
 *   - output `signedMessageHex`   — signed warp message hex with BLS sig
 */
export type AggregateSignaturesFn = (input: {
    unsignedMessageHex: Hex;
    signingSubnetId: string;
    justificationHex: Hex;
}) => Promise<Hex>;

export interface InitializeValidatorSetArgs {
    /** Address of the deployed ValidatorManager (or proxy of one). */
    contractAddress: Address;
    /** Avalanche network ID (1 mainnet, 5 fuji, 12345 local). */
    networkId: number;
    /** Subnet ID — base58check. */
    subnetId: string;
    /** Blockchain ID of the L1 where the contract lives — base58check. */
    blockchainId: string;
    /** Initial validators registered at conversion time, in submission order. */
    validators: InitialValidator[];
    /** Aggregate-signatures callback (e.g. wraps signature-aggregator). */
    aggregateSignatures: AggregateSignaturesFn;
}

export interface InitializeValidatorSetResult {
    /** Aggregated signed warp message hex that was packed into the access list. */
    signedMessageHex: Hex;
    /** Transaction hash of the `initializeValidatorSet` call. */
    txHash: Hex;
    /** Receipt of the `initializeValidatorSet` call (waited). */
    receipt: TransactionReceipt;
}

/**
 * Build the SubnetToL1Conversion warp message, aggregate L1 validator
 * signatures, and call `ValidatorManager.initializeValidatorSet(...)` on the
 * L1 EVM.
 *
 * The flow:
 *   1. Build canonical ConversionData → compute conversionID (sha256 of
 *      canonical bytes; see {@link newConversionData}).
 *   2. Wrap the conversionID as a `SubnetToL1ConversionMessage` AddressedCall
 *      payload.
 *   3. Wrap that in an UnsignedMessage with system source (no sender) and
 *      sourceChainID = P-Chain blockchainID
 *      (`11111111111111111111111111111111LpoYY`).
 *   4. Hand the UnsignedMessage to {@link AggregateSignaturesFn} to collect
 *      BLS signatures across the subnet's validators.
 *   5. Pack the signed message into an EVM access list pointed at the Warp
 *      precompile.
 *   6. Send `initializeValidatorSet(conversionData, messageIndex=0)` with
 *      that access list attached.
 *
 * The contract recomputes sha256 over the bytes carried in the access list
 * and asserts it matches the `conversionData` struct — if our
 * {@link newConversionData} layout diverged from AvalancheGo's canonical
 * bytes, the call would revert with `InvalidConversionID`.
 */
export async function initializeValidatorSet(
    walletClient: WalletClient,
    publicClient: PublicClient,
    args: InitializeValidatorSetArgs,
): Promise<InitializeValidatorSetResult> {
    // 1. Build canonical ConversionData and capture conversionID.
    const conversionData = newConversionData(
        args.subnetId,
        args.blockchainId,
        args.contractAddress,
        args.validators.map((v) => ({
            nodeId: v.nodeId,
            blsPublicKey: v.blsPublicKey,
            weight: v.weight,
        })),
    );
    const conversionIdHex = conversionData.getConversionId();

    // 2. SubnetToL1Conversion payload (the AddressedCall body). The helper
    //    takes a base58check-encoded ID, not hex — feeding hex causes a
    //    "Unknown letter: 0" from the base58 decoder.
    const subnetToL1ConversionMessage = newSubnetToL1ConversionMessage(
        utils.base58check.encode(utils.hexToBuffer(conversionIdHex)),
    );

    // 3. Wrap in UnsignedMessage. P-Chain is the source — its blockchainID is
    //    32 zero bytes in canonical form, base58check-encoded as
    //    "11111111111111111111111111111111LpoYY".
    const unsignedMessage = newWarpMessage(
        args.networkId,
        "11111111111111111111111111111111LpoYY", // P-Chain blockchainID
        "", // system source — no sender address
        subnetToL1ConversionMessage.toHex(),
    );
    const unsignedMessageHex = unsignedMessage.toHex() as Hex;

    // 4. Aggregate signatures.
    //    avalanchego's ACP-118 signature handler (vms/platformvm/network/
    //    warp.go#verifySubnetToL1Conversion) requires `justification` to
    //    be the 32-byte subnet ID — it parses with ids.ToID(justification)
    //    and queries `state.GetSubnetToL1Conversion(subnetID)`. Without
    //    a justification the verifier returns "failed to parse
    //    justification" and the validator never signs.
    const signedMessageHex = await args.aggregateSignatures({
        unsignedMessageHex,
        signingSubnetId: args.subnetId,
        justificationHex: base58checkToBytes32Hex(args.subnetId),
    });
    const signedBytes = utils.hexToBuffer(signedMessageHex);

    // 5. Pack into Warp-precompile access list.
    const accessList = packWarpIntoAccessList(signedBytes);

    // 6. Submit initializeValidatorSet(conversionData, messageIndex=0).
    //    The struct passed here mirrors the canonical bytes — the contract
    //    sha256s it and compares to what it pulls from the access list.
    type AvajsValidator = {
        nodeId: { toBytes(): Uint8Array };
        blsPublicKey: { toBytes(): Uint8Array };
        weight: { toBytes(): Uint8Array };
    };
    const initialValidators = (conversionData.validators as AvajsValidator[]).map((v) => ({
        nodeID: bytesToHex(v.nodeId.toBytes()),
        // weight is 8 bytes BE uint64.
        weight: readU64(v.weight.toBytes(), 0),
        blsPublicKey: bytesToHex(v.blsPublicKey.toBytes()),
    }));

    const conversionStruct = {
        subnetID: base58checkToBytes32Hex(args.subnetId),
        validatorManagerBlockchainID: base58checkToBytes32Hex(args.blockchainId),
        validatorManagerAddress: args.contractAddress,
        initialValidators,
    };

    // Pre-flight via simulateContract so a revert surfaces as a viem
    // BaseError chain (with abi-decoded revert reason) BEFORE we commit
    // the tx. Without this, writeContract + waitForTransactionReceipt
    // only returns status=reverted with no detail.
    try {
        await publicClient.simulateContract({
            address: args.contractAddress,
            abi: ValidatorManagerAbi,
            functionName: "initializeValidatorSet",
            args: [conversionStruct, 0],
            accessList,
            account: walletClient.account ?? undefined,
        } as never);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`initializeValidatorSet would revert: ${msg}`);
    }

    const txHash = await walletClient.writeContract({
        address: args.contractAddress,
        abi: ValidatorManagerAbi,
        functionName: "initializeValidatorSet",
        args: [conversionStruct, 0],
        accessList,
        chain: walletClient.chain,
        account: walletClient.account ?? null,
    } as never);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    console.log(`[initializeValidatorSet] receipt status=${receipt.status} gasUsed=${receipt.gasUsed} logs=${receipt.logs.length}`);
    if (receipt.status !== "success") {
        // Replay the tx against the pre-tx block (receipt.blockNumber - 1)
        // so the contract state is what it was right before the failed call.
        // Calling against receipt.blockNumber would replay against post-tx
        // state where the revert may no longer trigger.
        let revertReason = "<eth_call replay produced no error>";
        try {
            await publicClient.call({
                to: args.contractAddress,
                data: encodeFunctionData({
                    abi: ValidatorManagerAbi,
                    functionName: "initializeValidatorSet",
                    args: [conversionStruct, 0],
                }),
                account: walletClient.account ?? undefined,
                accessList,
                blockNumber: receipt.blockNumber - 1n,
            } as never);
        } catch (err: unknown) {
            revertReason = err instanceof Error ? err.message : String(err);
        }
        throw new Error(
            `initializeValidatorSet reverted on-chain (tx ${txHash}, block ${receipt.blockNumber}): ${revertReason}`,
        );
    }

    return { signedMessageHex, txHash, receipt };
}
