import { utils } from "@avalabs/avalanchejs";

import { parseAddressedCallPayload } from "../addressedCallPayload";
import {
    ADDRESSED_CALL_PAYLOAD_TYPE_ID,
    VALIDATION_UPTIME_PAYLOAD_LENGTH,
    WARP_CODEC_ID,
} from "../constants";
import { concatBytes, readU16, readU32, readU64, u16, u32, u64 } from "../utils";

// ValidationUptimeMessage layout (46 bytes):
//   codecID:      uint16  (always 0)
//   typeID:       uint32  (0 — shares typeID 0 with SubnetToL1Conversion; context disambiguates)
//   validationID: 32 bytes
//   uptime:       uint64  (seconds)
const TYPE_ID = ADDRESSED_CALL_PAYLOAD_TYPE_ID.ValidationUptime;
const PAYLOAD_LENGTH = VALIDATION_UPTIME_PAYLOAD_LENGTH;

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
 * Parses a ValidationUptimeMessage from a hex string. Accepts a raw payload
 * or any AddressedCall / UnsignedMessage / WarpMessage wrapping — the inner
 * payload is located via {@link parseAddressedCallPayload}'s cascade.
 */
export function parseValidationUptimeMessage(hex: string): ValidationUptimeMessage {
    const bytes = utils.hexToBuffer(hex);
    if (bytes.length === PAYLOAD_LENGTH) {
        return ValidationUptimeMessage.fromPayloadBytes(bytes);
    }
    const innerBytes = utils.hexToBuffer(
        `0x${parseAddressedCallPayload(hex).payload.toString("hex")}`,
    );
    return ValidationUptimeMessage.fromPayloadBytes(innerBytes);
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
        if (codecId !== WARP_CODEC_ID) throw new Error(`Invalid codecID ${codecId}`);
        const typeId = readU32(bytes, 2);
        if (typeId !== TYPE_ID) throw new Error(`Invalid typeID ${typeId}`);
        return new ValidationUptimeMessage(bytes.slice(6, 38), readU64(bytes, 38));
    }

    toBytes(): Uint8Array {
        return concatBytes(u16(WARP_CODEC_ID), u32(TYPE_ID), this.validationId, u64(this.uptime));
    }

    toHex(): string {
        return utils.bufferToHex(this.toBytes());
    }
}
