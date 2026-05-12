import { utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, hexToBytes, parseAbiItem } from "viem";
import { parseRegisterL1ValidatorMessage } from "./addressedCallMessages/registerL1ValidatorMessage";
import { WARP_PRECOMPILE_ADDRESS } from "./evm";

// ─── protobuf varint encoding ────────────────────────────────────────────────

function encodeVarint(value: number): Uint8Array {
    const bytes: number[] = [];
    while (value >= 0x80) {
        bytes.push((value & 0x7f) | 0x80);
        value >>>= 7;
    }
    bytes.push(value);
    return new Uint8Array(bytes);
}

function uint32BE(value: number): Uint8Array {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, value, false);
    return b;
}

// ─── byte helpers ────────────────────────────────────────────────────────────

function concat(...parts: Uint8Array[]): Uint8Array {
    const total = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const p of parts) { out.set(p, off); off += p.length; }
    return out;
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

// ─── justification marshalling ───────────────────────────────────────────────

// L1ValidatorRegistrationJustification {
//   oneof preimage {
//     SubnetIDIndex convert_subnet_to_l1_tx_data = 1;
//     bytes register_l1_validator_message       = 2;
//   }
// }
// SubnetIDIndex { bytes subnet_id = 1; uint32 index = 2; }

function marshalBootstrapJustification(subnetIdBytes: Uint8Array, index: number): Uint8Array {
    // Inner SubnetIDIndex message
    const subnetIdTag = new Uint8Array([0x0a]);            // field 1, wire type 2 (length-delimited)
    const subnetIdLen = encodeVarint(subnetIdBytes.length);
    const indexTag = new Uint8Array([0x10]);               // field 2, wire type 0 (varint)
    const indexVarint = encodeVarint(index);
    const inner = concat(subnetIdTag, subnetIdLen, subnetIdBytes, indexTag, indexVarint);

    // Outer message, field 1 (convert_subnet_to_l1_tx_data)
    const outerTag = new Uint8Array([0x0a]);
    const outerLen = encodeVarint(inner.length);
    return concat(outerTag, outerLen, inner);
}

function marshalRegisterMessageJustification(registerL1ValidatorMessagePayload: Uint8Array): Uint8Array {
    // Field 2: register_l1_validator_message (bytes), wire type 2
    const tag = new Uint8Array([0x12]);
    const len = encodeVarint(registerL1ValidatorMessagePayload.length);
    return concat(tag, len, registerL1ValidatorMessagePayload);
}

// ─── raw warp/addressedCall byte parsing (for log scanning) ──────────────────

function extractAddressedCallFromUnsignedMessage(messageBytes: Uint8Array): Uint8Array {
    // UnsignedMessage layout: codec(2) + networkID(4) + sourceChainID(32) + msgLen(4) + msg(N)
    if (messageBytes.length < 42) return new Uint8Array();
    const dv = new DataView(messageBytes.buffer, messageBytes.byteOffset, messageBytes.byteLength);
    const msgLen = dv.getUint32(38, false);
    if (msgLen <= 0 || 42 + msgLen > messageBytes.length) return new Uint8Array();
    return messageBytes.slice(42, 42 + msgLen);
}

function extractPayloadFromAddressedCallBytes(addressedCall: Uint8Array): Uint8Array | null {
    // AddressedCall layout: codec(2) + typeID(4) + srcAddrLen(4) + srcAddr + payloadLen(4) + payload
    if (addressedCall.length < 10) return null;
    const dv = new DataView(addressedCall.buffer, addressedCall.byteOffset, addressedCall.byteLength);
    const srcAddrLen = dv.getUint32(6, false);
    const payloadLenPos = 10 + srcAddrLen;
    if (payloadLenPos + 4 > addressedCall.length) return null;
    const payloadLen = dv.getUint32(payloadLenPos, false);
    if (payloadLen <= 0) return null;
    const start = payloadLenPos + 4;
    const end = start + payloadLen;
    if (end > addressedCall.length) return null;
    return addressedCall.slice(start, end);
}

// ─── public API ──────────────────────────────────────────────────────────────

const SEND_WARP_MESSAGE_EVENT = parseAbiItem(
    "event SendWarpMessage(address indexed sourceAddress, bytes32 indexed unsignedMessageID, bytes message)",
);

const REGISTER_L1_VALIDATOR_MESSAGE_TYPE_ID = 1;

/** A minimal subset of a viem PublicClient — enough to scan warp logs. */
export interface JustificationPublicClient {
    getBlockNumber: () => Promise<bigint>;
    getLogs: (args: any) => Promise<any[]>;
}

/** Options for {@link getRegistrationJustification}. */
export interface GetRegistrationJustificationOptions {
    /**
     * How many bootstrap validator indices to derive and hash before giving up on the
     * bootstrap path. Defaults to 100.
     */
    bootstrapSearchLimit?: number;
    /** Block range per `eth_getLogs` call. Defaults to 2000. */
    logChunkSize?: number;
    /** Max chunks to walk backwards before giving up the log scan. Defaults to 100. */
    maxLogChunks?: number;
    /** Override the Warp precompile address (almost never needed). */
    warpAddress?: `0x${string}`;
}

/**
 * Builds the `L1ValidatorRegistrationJustification` protobuf for a given validation ID.
 *
 * First tries to interpret the validation ID as the hash of a bootstrap validator
 * (sha256(subnetID || index_uint32_be)). If that doesn't match, scans the Warp precompile
 * event log on the L1 chain backwards in chunks looking for a `RegisterL1ValidatorMessage`
 * whose payload hashes to the validation ID, and wraps that payload as the justification.
 *
 * Used as the `justification` argument when calling the signature aggregator for
 * `L1ValidatorRegistrationMessage` (registration/removal ACK) and change-weight flows.
 *
 * @param validationIdHex - The validation ID as a 0x-prefixed 32-byte hex string.
 * @param subnetId - The subnet ID as a base58check string.
 * @param publicClient - A viem-compatible public client for `getLogs` / `getBlockNumber`.
 * @param options - Tuning knobs ({@link GetRegistrationJustificationOptions}).
 * @returns The protobuf-marshalled justification bytes, or `null` if no match found.
 */
export async function getRegistrationJustification(
    validationIdHex: string,
    subnetId: string,
    publicClient: JustificationPublicClient,
    options: GetRegistrationJustificationOptions = {},
): Promise<Uint8Array | null> {
    const {
        bootstrapSearchLimit = 100,
        logChunkSize = 2000,
        maxLogChunks = 100,
        warpAddress = WARP_PRECOMPILE_ADDRESS,
    } = options;

    let targetValidationIdBytes: Uint8Array;
    try {
        targetValidationIdBytes = hexToBytes(validationIdHex as `0x${string}`);
    } catch {
        return null;
    }
    if (targetValidationIdBytes.length !== 32) return null;

    let subnetIdBytes: Uint8Array;
    try {
        subnetIdBytes = utils.base58check.decode(subnetId);
    } catch {
        return null;
    }

    // 1. Bootstrap validator: validationID = sha256(subnetID || index_be_u32)
    for (let index = 0; index < bootstrapSearchLimit; index++) {
        const derived = concat(subnetIdBytes, uint32BE(index));
        const hash = sha256(derived);
        if (bytesEqual(hash, targetValidationIdBytes)) {
            return marshalBootstrapJustification(subnetIdBytes, index);
        }
    }

    // 2. Scan warp logs backwards for a RegisterL1ValidatorMessage whose hash matches.
    let toBlock: bigint | "latest" = "latest";
    let chunksSearched = 0;
    while (chunksSearched < maxLogChunks) {
        const latest: bigint = toBlock === "latest" ? await publicClient.getBlockNumber() : toBlock;
        const fromBlock: bigint = latest > BigInt(logChunkSize) ? latest - BigInt(logChunkSize) : 0n;

        let logs: any[];
        try {
            logs = await publicClient.getLogs({
                address: warpAddress,
                event: SEND_WARP_MESSAGE_EVENT,
                fromBlock,
                toBlock: toBlock === "latest" ? toBlock : (toBlock as bigint),
            });
        } catch {
            return null;
        }

        for (const log of logs.slice().reverse()) {
            const fullMessageHex = (log?.args as { message?: `0x${string}` } | undefined)?.message;
            if (!fullMessageHex) continue;
            const unsignedBytes = hexToBytes(fullMessageHex);
            const addressedCall = extractAddressedCallFromUnsignedMessage(unsignedBytes);
            if (addressedCall.length < 6) continue;

            const acTypeId = new DataView(
                addressedCall.buffer, addressedCall.byteOffset, addressedCall.byteLength,
            ).getUint32(2, false);
            if (acTypeId !== REGISTER_L1_VALIDATOR_MESSAGE_TYPE_ID) continue;

            const payloadBytes = extractPayloadFromAddressedCallBytes(addressedCall);
            if (!payloadBytes) continue;

            try {
                parseRegisterL1ValidatorMessage(bytesToHex(payloadBytes));
            } catch {
                continue;
            }
            if (bytesEqual(sha256(payloadBytes), targetValidationIdBytes)) {
                return marshalRegisterMessageJustification(payloadBytes);
            }
        }

        if (fromBlock === 0n) break;
        toBlock = fromBlock - 1n;
        chunksSearched++;
    }

    return null;
}
