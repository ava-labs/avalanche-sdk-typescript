import { utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, hexToBytes, parseAbiItem } from "viem";

import { parseRegisterL1ValidatorMessage } from "./addressedCallMessages/registerL1ValidatorMessage";
import {
    ADDRESSED_CALL_PAYLOAD_TYPE_ID,
    JUSTIFICATION_DEFAULTS,
} from "./constants";
import { WARP_PRECOMPILE_ADDRESS } from "./evm";
import {
    readAddressedCallFromUnsignedMessage,
    readAddressedCallTypeId,
    readPayloadFromAddressedCall,
} from "./serialization";
import { bytesEqual, concatBytes, u32 } from "./utils";

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
    const inner = concatBytes(subnetIdTag, subnetIdLen, subnetIdBytes, indexTag, indexVarint);

    // Outer message, field 1 (convert_subnet_to_l1_tx_data)
    const outerTag = new Uint8Array([0x0a]);
    const outerLen = encodeVarint(inner.length);
    return concatBytes(outerTag, outerLen, inner);
}

/**
 * Wrap a `RegisterL1ValidatorMessage` payload (the AddressedCall body bytes,
 * NOT the outer warp message) into the protobuf
 * `L1ValidatorRegistrationJustification` form expected by avalanchego's
 * `verifyL1ValidatorRegistration` when `registered=false`.
 *
 * Exported so callers that already have the raw register payload (e.g. via
 * {@link import("../validator-manager/registerL1Validator.js").RegisterL1ValidatorResult.registerMessagePayloadHex})
 * can build the justification directly and skip the L1 warp-log scan in
 * {@link getRegistrationJustification}.
 */
export function marshalRegisterMessageJustification(registerL1ValidatorMessagePayload: Uint8Array): Uint8Array {
    // Field 2: register_l1_validator_message (bytes), wire type 2
    const tag = new Uint8Array([0x12]);
    const len = encodeVarint(registerL1ValidatorMessagePayload.length);
    return concatBytes(tag, len, registerL1ValidatorMessagePayload);
}

// ─── public API ──────────────────────────────────────────────────────────────

const SEND_WARP_MESSAGE_EVENT = parseAbiItem(
    "event SendWarpMessage(address indexed sourceAddress, bytes32 indexed unsignedMessageID, bytes message)",
);

/**
 * A minimal subset of a viem PublicClient — enough to scan warp logs.
 *
 * Typed loosely (`args: unknown`) so any viem PublicClient is assignable; the function
 * narrows the log shape it cares about internally.
 */
export interface JustificationPublicClient {
    getBlockNumber: () => Promise<bigint>;
    getLogs: (args: unknown) => Promise<unknown[]>;
}

/** The single log shape we depend on after `getLogs` returns. */
interface ScannedWarpLog {
    args?: { message?: `0x${string}` };
}

/** Options for {@link getRegistrationJustification}. */
export interface GetRegistrationJustificationOptions {
    /**
     * How many bootstrap validator indices to derive and hash before giving up on the
     * bootstrap path. Defaults to 1000 — each iteration is just a sha256, so the cost
     * is negligible and the wider window survives L1s with many bootstrap validators.
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
        bootstrapSearchLimit = JUSTIFICATION_DEFAULTS.BOOTSTRAP_SEARCH_LIMIT,
        logChunkSize = JUSTIFICATION_DEFAULTS.LOG_CHUNK_SIZE,
        maxLogChunks = JUSTIFICATION_DEFAULTS.MAX_LOG_CHUNKS,
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
        const derived = concatBytes(subnetIdBytes, u32(index));
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

        let logs: ScannedWarpLog[];
        try {
            logs = (await publicClient.getLogs({
                address: warpAddress,
                event: SEND_WARP_MESSAGE_EVENT,
                fromBlock,
                toBlock: toBlock === "latest" ? toBlock : (toBlock as bigint),
            })) as ScannedWarpLog[];
        } catch {
            return null;
        }

        for (const log of logs.slice().reverse()) {
            const fullMessageHex = log?.args?.message;
            if (!fullMessageHex) continue;
            const unsignedBytes = hexToBytes(fullMessageHex);
            const addressedCall = readAddressedCallFromUnsignedMessage(unsignedBytes);
            const acTypeId = readAddressedCallTypeId(addressedCall);
            if (acTypeId !== ADDRESSED_CALL_PAYLOAD_TYPE_ID.RegisterL1Validator) continue;

            const payloadBytes = readPayloadFromAddressedCall(addressedCall);
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
