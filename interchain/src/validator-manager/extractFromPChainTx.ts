import { utils } from "@avalabs/avalanchejs";
import type { Hex } from "viem";

import { newConversionData } from "../warp/addressedCallMessages/conversionData.js";
import { parseL1ValidatorWeightMessage } from "../warp/addressedCallMessages/l1ValidatorWeightMessage.js";
import { parseRegisterL1ValidatorMessage } from "../warp/addressedCallMessages/registerL1ValidatorMessage.js";
import { newSubnetToL1ConversionMessage } from "../warp/addressedCallMessages/subnetToL1ConversionMessage.js";
import { parseAddressedCallPayload } from "../warp/addressedCallPayload.js";
import { newWarpMessage } from "../warp/newWarpMessage.js";
import { parseWarpUnsignedMessage } from "../warp/warpUnsignedMessage.js";

/**
 * Common arguments accepted by every `extract*FromPChainTx` helper.
 *
 * The SDK doesn't ship a P-Chain client. Instead, callers pass the JSON-RPC URL
 * (and optionally a custom `fetch` for tests / Node < 18); the helper makes a
 * single `platform.getTx` call and unwraps the warp message itself.
 */
export interface ExtractFromPChainTxArgs {
    /** P-Chain transaction ID (base58check). */
    txId: string;
    /**
     * P-Chain JSON-RPC URL, e.g.:
     *   - `https://api.avax.network/ext/bc/P` (mainnet)
     *   - `https://api.avax-test.network/ext/bc/P` (fuji)
     *   - `http://localhost:9650/ext/bc/P` (local)
     */
    pChainRpcUrl: string;
    /**
     * Optional custom fetch implementation. Defaults to the global `fetch`.
     * Tests pass an in-memory mock to avoid hitting the network.
     */
    fetchFn?: typeof fetch;
}

/**
 * Minimal shape of `platform.getTx` `unsignedTx` we rely on. The helpers
 * read `message` (warp message hex) plus tx-specific fields for the
 * conversion variant; everything else is ignored.
 */
export interface PChainUnsignedTxShape {
    message?: string;
    subnetID?: string;
    chainID?: string;
    blockchainID?: string;
    address?: string;
    validators?: Array<PChainConversionTxValidator>;
    [key: string]: unknown;
}

/**
 * Validator entry as it appears under `unsignedTx.validators` in a
 * `platform.getTx` response for a `ConvertSubnetToL1Tx`.
 */
export interface PChainConversionTxValidator {
    nodeID: string;
    weight: number;
    balance: number;
    signer: {
        publicKey: string;
        proofOfPossession: string;
    };
    remainingBalanceOwner: {
        threshold: number;
        addresses: string[];
    };
    deactivationOwner: {
        threshold: number;
        addresses: string[];
    };
}

interface PlatformGetTxResponse {
    result?: {
        tx?: {
            unsignedTx?: PChainUnsignedTxShape;
        };
    };
    error?: {
        message?: string;
    };
}

/**
 * Fetch a P-Chain tx by id and return its `unsignedTx`. Throws on RPC error or
 * if the response shape is unexpected.
 */
async function fetchUnsignedPChainTx(args: ExtractFromPChainTxArgs): Promise<PChainUnsignedTxShape> {
    const fetchImpl = args.fetchFn ?? fetch;
    const response = await fetchImpl(args.pChainRpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "platform.getTx",
            params: { txID: args.txId, encoding: "json" },
            id: 1,
        }),
    });
    if (!response.ok) {
        throw new Error(`P-Chain RPC returned ${response.status}: ${response.statusText}`);
    }
    const data = (await response.json()) as PlatformGetTxResponse;
    if (data.error?.message) {
        throw new Error(`P-Chain RPC error: ${data.error.message}`);
    }
    const unsignedTx = data.result?.tx?.unsignedTx;
    if (!unsignedTx) {
        throw new Error("Invalid P-Chain transaction response — missing tx.unsignedTx");
    }
    return unsignedTx;
}

/**
 * Unwrap `WarpUnsignedMessage → AddressedCall → innerPayload` from a tx that
 * carries a warp message in `unsignedTx.message`.
 */
function unwrapInnerPayloadHex(unsignedTx: PChainUnsignedTxShape): Hex {
    const message = unsignedTx.message;
    if (typeof message !== "string" || message.length === 0) {
        throw new Error("P-Chain transaction does not carry a warp message");
    }
    const warpUnsigned = parseWarpUnsignedMessage(message);
    const addressedCallHex = `0x${warpUnsigned.payload.toString("hex")}`;
    const addressedCall = parseAddressedCallPayload(addressedCallHex);
    return `0x${addressedCall.payload.toString("hex")}` as Hex;
}

// ---------------------------------------------------------------------------
// RegisterL1ValidatorMessage
// ---------------------------------------------------------------------------

export interface ExtractRegisterL1ValidatorMessageResult {
    /** Inner `RegisterL1ValidatorMessage` payload hex (the AddressedCall's payload). */
    messageHex: Hex;
    /** 32-byte subnet ID, 0x-hex. */
    subnetIdHex: Hex;
    /** 20-byte node ID, 0x-hex. */
    nodeIdHex: Hex;
    /** 48-byte compressed BLS public key, 0x-hex. */
    blsPublicKey: Hex;
    /** Registration expiry as a Unix timestamp in seconds. */
    expiry: bigint;
    /** Initial validator weight. */
    weight: bigint;
}

/**
 * Fetch a `RegisterL1ValidatorTx` from P-Chain and extract the inner
 * `RegisterL1ValidatorMessage` payload + decoded fields.
 *
 * The returned `messageHex` is the AddressedCall's inner payload —
 * suitable for re-encoding or rebuilding the warp message for signing.
 *
 * @throws If the tx doesn't exist, is the wrong type, or doesn't carry a
 *         warp message.
 */
export async function extractRegisterL1ValidatorMessageFromPChainTx(
    args: ExtractFromPChainTxArgs,
): Promise<ExtractRegisterL1ValidatorMessageResult> {
    const unsignedTx = await fetchUnsignedPChainTx(args);
    const innerPayloadHex = unwrapInnerPayloadHex(unsignedTx);
    const parsed = parseRegisterL1ValidatorMessage(innerPayloadHex);
    return {
        messageHex: innerPayloadHex,
        subnetIdHex: utils.bufferToHex(parsed.subnetId.toBytes()) as Hex,
        nodeIdHex: utils.bufferToHex(parsed.nodeId.toBytes()) as Hex,
        blsPublicKey: utils.bufferToHex(parsed.blsPublicKey.toBytes()) as Hex,
        expiry: parsed.expiry.value(),
        weight: parsed.weight.value(),
    };
}

// ---------------------------------------------------------------------------
// L1ValidatorWeightMessage
// ---------------------------------------------------------------------------

export interface ExtractL1ValidatorWeightMessageResult {
    /** Inner `L1ValidatorWeightMessage` payload hex. */
    messageHex: Hex;
    /** 32-byte validation ID, 0x-hex. */
    validationIdHex: Hex;
    /** Monotonically-increasing nonce of the weight update. */
    nonce: bigint;
    /** New weight assigned to the validator. */
    weight: bigint;
}

/**
 * Fetch a `SetL1ValidatorWeightTx` from P-Chain and extract the inner
 * `L1ValidatorWeightMessage` payload + decoded fields.
 */
export async function extractL1ValidatorWeightMessageFromPChainTx(
    args: ExtractFromPChainTxArgs,
): Promise<ExtractL1ValidatorWeightMessageResult> {
    const unsignedTx = await fetchUnsignedPChainTx(args);
    const innerPayloadHex = unwrapInnerPayloadHex(unsignedTx);
    const parsed = parseL1ValidatorWeightMessage(innerPayloadHex);
    return {
        messageHex: innerPayloadHex,
        validationIdHex: utils.bufferToHex(parsed.validationId.toBytes()) as Hex,
        nonce: parsed.nonce.value(),
        weight: parsed.weight.value(),
    };
}

// ---------------------------------------------------------------------------
// SubnetToL1ConversionData
// ---------------------------------------------------------------------------

export interface ExtractSubnetToL1ConversionDataArgs extends ExtractFromPChainTxArgs {
    /**
     * Avalanche network ID (1 mainnet, 5 fuji, 12345 local). Used as the
     * `networkId` field of the rebuilt `WarpUnsignedMessage`; must match what
     * the signature-aggregator will use, or signatures won't verify.
     */
    networkId: number;
}

export interface ExtractSubnetToL1ConversionDataResult {
    /**
     * Unsigned `SubnetToL1ConversionMessage` warp message hex — feed this to
     * the signature aggregator together with `justificationHex` (below) as
     * the `justification` parameter.
     */
    unsignedMessageHex: Hex;
    /**
     * ConversionData preimage hex. Aggregators need this as the
     * `justification` so avalanchego's verifier can recompute the
     * conversionID.
     */
    justificationHex: Hex;
    /** Computed 32-byte conversion ID, 0x-hex. */
    conversionIdHex: Hex;
    /** Subnet ID (base58check). */
    subnetId: string;
    /** L1 blockchain ID (base58check). */
    blockchainId: string;
    /** ValidatorManager contract address (or proxy of one). */
    managerAddress: Hex;
    /** Validators as they appear in the tx (preserves the on-chain ordering). */
    validators: PChainConversionTxValidator[];
}

/**
 * Fetch a `ConvertSubnetToL1Tx` from P-Chain and produce everything needed
 * to drive `initializeValidatorSet` end-to-end:
 *
 *   - the unsigned `SubnetToL1ConversionMessage` warp message (for signature
 *     aggregation)
 *   - the `ConversionData` preimage hex (= justification for the aggregator)
 *   - the computed conversion ID
 *   - the validators list as it appeared on-chain (caller may need to
 *     resolve `signingSubnetId` separately via Glacier or another indexer)
 *
 * @throws If the tx isn't a ConvertSubnetToL1Tx or lacks the required fields.
 */
export async function extractSubnetToL1ConversionDataFromPChainTx(
    args: ExtractSubnetToL1ConversionDataArgs,
): Promise<ExtractSubnetToL1ConversionDataResult> {
    const unsignedTx = await fetchUnsignedPChainTx(args);
    const { subnetID, chainID, address, validators: rawValidators, blockchainID } = unsignedTx;
    if (!subnetID || !chainID || !address || !rawValidators || !blockchainID) {
        throw new Error(
            "P-Chain transaction is missing required ConvertSubnetToL1Tx fields " +
                "(subnetID / chainID / address / validators / blockchainID)",
        );
    }

    // newConversionData sorts validators by raw nodeId bytes internally for
    // canonical conversionID hashing.
    const sdkValidators = rawValidators.map((v) => ({
        nodeId: v.nodeID,
        blsPublicKey: v.signer.publicKey,
        weight: BigInt(v.weight),
    }));

    const conversionData = newConversionData(subnetID, chainID, address, sdkValidators);
    const conversionIdHex = conversionData.getConversionId() as Hex;
    const conversionIdCB58 = utils.base58check.encode(utils.hexToBuffer(conversionIdHex));

    // Build the SubnetToL1ConversionMessage and wrap it in a WarpUnsignedMessage.
    const innerMsg = newSubnetToL1ConversionMessage(conversionIdCB58);
    const unsigned = newWarpMessage(args.networkId, blockchainID, "", innerMsg.toHex());

    return {
        unsignedMessageHex: unsigned.toHex() as Hex,
        justificationHex: conversionData.toHex() as Hex,
        conversionIdHex,
        subnetId: subnetID,
        blockchainId: chainID,
        managerAddress: (address.startsWith("0x") ? address : `0x${address}`) as Hex,
        validators: rawValidators,
    };
}
