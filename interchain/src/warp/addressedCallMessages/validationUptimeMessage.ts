import { utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";
import { parseWarpUnsignedMessage } from "../warpUnsignedMessage";
import { parseWarpMessage } from "../warpMessage";

// ValidationUptimeMessage layout (46 bytes):
//   codecID:      uint16  (always 0)
//   typeID:       uint32  (0 — note: shares 0 with SubnetToL1Conversion; context determines which)
//   validationID: 32 bytes
//   uptime:       uint64  (seconds)
const CODEC_ID = 0;
const TYPE_ID = 0;
const PAYLOAD_LENGTH = 46;

function u16(n: number): Uint8Array {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, n, false);
    return b;
}
function u32(n: number): Uint8Array {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n, false);
    return b;
}
function u64(n: bigint): Uint8Array {
    const b = new Uint8Array(8);
    new DataView(b.buffer).setBigUint64(0, n, false);
    return b;
}
function readU16(b: Uint8Array, o: number): number {
    return new DataView(b.buffer, b.byteOffset, b.byteLength).getUint16(o, false);
}
function readU32(b: Uint8Array, o: number): number {
    return new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(o, false);
}
function readU64(b: Uint8Array, o: number): bigint {
    return new DataView(b.buffer, b.byteOffset, b.byteLength).getBigUint64(o, false);
}
function concat(...parts: Uint8Array[]): Uint8Array {
    const len = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(len);
    let off = 0;
    for (const p of parts) { out.set(p, off); off += p.length; }
    return out;
}

/**
 * Creates a new ValidationUptimeMessage payload (the inner AddressedCall payload).
 *
 * To produce a full UnsignedMessage, wrap with `newAddressedCallPayload('', msg.toHex())`
 * then `newWarpUnsignedMessage(...)`, or use `newWarpMessage(...)`.
 *
 * @param validationId - The validation ID (base58check encoded).
 * @param uptime - Validator uptime in seconds.
 */
export function newValidationUptimeMessage(validationId: string, uptime: bigint): ValidationUptimeMessage {
    const validationIdBytes = utils.base58check.decode(validationId);
    if (validationIdBytes.length !== 32) {
        throw new Error(`ValidationID must be 32 bytes, got ${validationIdBytes.length}`);
    }
    return new ValidationUptimeMessage(validationIdBytes, uptime);
}

/**
 * Parses a ValidationUptimeMessage from a hex string.
 *
 * Accepts either a raw payload, an AddressedCall-wrapped payload, an UnsignedMessage,
 * or a signed WarpMessage — the inner payload will be located.
 */
export function parseValidationUptimeMessage(hex: string): ValidationUptimeMessage {
    const bytes = utils.hexToBuffer(hex);
    if (bytes.length === PAYLOAD_LENGTH) {
        return ValidationUptimeMessage.fromPayloadBytes(bytes);
    }
    // Try each wrapping layer in turn. Each parse step yields the inner payload hex;
    // we then check whether it's the 46-byte ValidationUptime payload or needs more unwrapping.
    const candidates: Array<() => string> = [
        () => `0x${parseAddressedCallPayload(hex).payload.toString('hex')}`,
        () => `0x${parseWarpUnsignedMessage(hex).payload.toString('hex')}`,
        () => `0x${parseWarpMessage(hex).unsignedMessage.payload.toString('hex')}`,
    ];
    for (const next of candidates) {
        try {
            const innerHex = next();
            const innerBytes = utils.hexToBuffer(innerHex);
            if (innerBytes.length === PAYLOAD_LENGTH) {
                return ValidationUptimeMessage.fromPayloadBytes(innerBytes);
            }
            // The inner bytes are still wrapped — recurse once.
            return parseValidationUptimeMessage(innerHex);
        } catch { /* try next */ }
    }
    throw new Error(
        `Cannot parse ValidationUptimeMessage from input: not a raw payload, AddressedCall, UnsignedMessage, or signed WarpMessage`,
    );
}

export class ValidationUptimeMessage {
    public readonly validationId: Uint8Array;
    public readonly uptime: bigint;

    constructor(validationId: Uint8Array, uptime: bigint) {
        this.validationId = validationId;
        this.uptime = uptime;
    }

    static fromHex(hex: string): ValidationUptimeMessage {
        return parseValidationUptimeMessage(hex);
    }

    static fromValues(validationId: string, uptime: bigint): ValidationUptimeMessage {
        return newValidationUptimeMessage(validationId, uptime);
    }

    static fromPayloadBytes(bytes: Uint8Array): ValidationUptimeMessage {
        if (bytes.length !== PAYLOAD_LENGTH) {
            throw new Error(
                `ValidationUptimeMessage payload must be ${PAYLOAD_LENGTH} bytes, got ${bytes.length}`,
            );
        }
        const codecId = readU16(bytes, 0);
        if (codecId !== CODEC_ID) throw new Error(`Invalid codecID ${codecId}`);
        const typeId = readU32(bytes, 2);
        if (typeId !== TYPE_ID) throw new Error(`Invalid typeID ${typeId}`);
        const validationId = bytes.slice(6, 38);
        const uptime = readU64(bytes, 38);
        return new ValidationUptimeMessage(validationId, uptime);
    }

    toBytes(): Uint8Array {
        return concat(u16(CODEC_ID), u32(TYPE_ID), this.validationId, u64(this.uptime));
    }

    toHex(): string {
        return utils.bufferToHex(this.toBytes());
    }
}
