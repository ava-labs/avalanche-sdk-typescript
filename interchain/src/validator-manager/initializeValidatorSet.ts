import { utils } from "@avalabs/avalanchejs";
import {
    type Address,
    type Hex,
    type WalletClient,
    type PublicClient,
    type TransactionReceipt,
} from "viem";

import { newConversionData } from "../warp/addressedCallMessages/conversionData.js";
import { newSubnetToL1ConversionMessage } from "../warp/addressedCallMessages/subnetToL1ConversionMessage.js";
import { newWarpMessage } from "../warp/newWarpMessage.js";
import { packWarpIntoAccessList } from "../warp/evm.js";
import { ValidatorManagerAbi } from "./artifacts/ValidatorManager.js";

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
 *   - output `signedMessageHex`   — signed warp message hex with BLS sig
 */
export type AggregateSignaturesFn = (input: {
    unsignedMessageHex: Hex;
    signingSubnetId: string;
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

    // 2. SubnetToL1Conversion payload (the AddressedCall body).
    const subnetToL1ConversionMessage = newSubnetToL1ConversionMessage(
        conversionIdHex.replace(/^0x/, ""),
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

    // 4. Aggregate signatures across the L1's validators.
    const signedMessageHex = await args.aggregateSignatures({
        unsignedMessageHex,
        signingSubnetId: args.subnetId,
    });
    const signedBytes = utils.hexToBuffer(signedMessageHex);

    // 5. Pack into Warp-precompile access list.
    const accessList = packWarpIntoAccessList(signedBytes);

    // 6. Submit initializeValidatorSet(conversionData, messageIndex=0).
    //    The struct passed here mirrors the canonical bytes — the contract
    //    sha256s it and compares to what it pulls from the access list.
    const initialValidators = conversionData.validators.map(
        (v: { nodeId: { toBytes(): Uint8Array }; blsPublicKey: { toBytes(): Uint8Array }; weight: { toBytes(): Uint8Array } }) => {
            const weightBytes = v.weight.toBytes();
            // weight is 8 bytes BE uint64 — decode to bigint.
            let weight = 0n;
            for (const b of weightBytes) weight = (weight << 8n) | BigInt(b);
            return {
                nodeID: (`0x${Buffer.from(v.nodeId.toBytes()).toString("hex")}`) as Hex,
                weight,
                blsPublicKey: (`0x${Buffer.from(v.blsPublicKey.toBytes()).toString("hex")}`) as Hex,
            };
        },
    );

    const subnetIdBytes32 = (`0x${Buffer.from(utils.base58check.decode(args.subnetId)).toString("hex")}`) as Hex;
    const blockchainIdBytes32 = (`0x${Buffer.from(utils.base58check.decode(args.blockchainId)).toString("hex")}`) as Hex;

    const conversionStruct = {
        subnetID: subnetIdBytes32,
        validatorManagerBlockchainID: blockchainIdBytes32,
        validatorManagerAddress: args.contractAddress,
        initialValidators,
    };

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

    return { signedMessageHex, txHash, receipt };
}
