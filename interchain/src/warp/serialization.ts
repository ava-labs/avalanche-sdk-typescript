import { pvmSerial, Short, utils } from "@avalabs/avalanchejs";

import { parseAddressedCallPayload } from "./addressedCallPayload";
import { ADDRESSED_CALL_OFFSETS, UNSIGNED_MESSAGE_OFFSETS } from "./constants";

const warpManager = pvmSerial.warp.getWarpManager();

// ---------------------------------------------------------------------------
// Warp codec helpers
// ---------------------------------------------------------------------------

/**
 * Anything that knows how to emit its own canonical Avalanche bytes when
 * handed the warp codec. avalanchejs's serializable classes all implement
 * this shape — we erase the specific codec type to keep the helper
 * usable from this package without re-exporting it.
 */
interface WarpSerializable {
    toBytes(codec: unknown): Uint8Array;
}

/**
 * Prepend the 2-byte warp codec ID (0x0000) to the underlying canonical
 * bytes of an avalanchejs serializable and return as 0x-hex. This is the
 * canonical wire format every {@link AddressedCallPayload}-derived class
 * exposes via its `toHex()` method.
 */
export function encodeWithCodec(self: WarpSerializable): string {
    const codecBytes = new Short(0).toBytes();
    const bodyBytes = self.toBytes(pvmSerial.warp.codec);
    return utils.bufferToHex(Buffer.concat([codecBytes, bodyBytes]));
}

/**
 * Try to unpack `hex` directly as `schema`; on failure, peel off the
 * AddressedCall / UnsignedMessage / WarpMessage wrapping (via
 * {@link parseAddressedCallPayload}'s own cascade) and recurse into
 * `parseSelf` with the inner payload.
 *
 * This is the parse pattern used by every AddressedCall payload message
 * (SubnetToL1Conversion, L1ValidatorRegistration, L1ValidatorWeight,
 * RegisterL1Validator, etc.) — caller-friendly: a hex blob from any layer
 * resolves to the innermost payload class.
 */
export function parseWithAddressedCallFallback<T, S>(
    hex: string,
    schema: new (...args: never[]) => S,
    build: (unpacked: S) => T,
    parseSelf: (hex: string) => T,
): T {
    try {
        const unpacked = warpManager.unpack(utils.hexToBuffer(hex), schema as never) as S;
        return build(unpacked);
    } catch {
        const wrapper = parseAddressedCallPayload(hex);
        return parseSelf(wrapper.payload.toString("hex"));
    }
}

/**
 * Standard throw for classes that override the inherited static
 * `fromBytes` to forbid direct use (callers should go via fromHex /
 * fromValues so codec handling stays consistent).
 */
export function throwNoDirectFromBytes(typeName: string): never {
    throw new Error(`Do not use \`${typeName}.fromBytes\` method directly.`);
}

// ---------------------------------------------------------------------------
// Raw byte-layout readers
//
// These bypass avalanchejs's `unpack` and read only the bytes they need.
// Useful when scanning EVM logs / receipts where we want to quickly filter
// by AddressedCall typeID before paying full unpack cost, or when the blob
// might not be a well-formed payload at all.
// ---------------------------------------------------------------------------

/**
 * Returns the inner AddressedCall bytes from an UnsignedMessage blob.
 * Returns an empty array if the blob is too short or the embedded length
 * prefix points past the end of the buffer.
 *
 * UnsignedMessage layout:
 *   codec(2) | networkID(4) | sourceChainID(32) | msgLen(4) | msg(N)
 */
export function readAddressedCallFromUnsignedMessage(messageBytes: Uint8Array): Uint8Array {
    if (messageBytes.length < UNSIGNED_MESSAGE_OFFSETS.MSG_START) return new Uint8Array();
    const dv = new DataView(messageBytes.buffer, messageBytes.byteOffset, messageBytes.byteLength);
    const msgLen = dv.getUint32(UNSIGNED_MESSAGE_OFFSETS.MSG_LEN, false);
    if (msgLen <= 0 || UNSIGNED_MESSAGE_OFFSETS.MSG_START + msgLen > messageBytes.length) {
        return new Uint8Array();
    }
    return messageBytes.slice(
        UNSIGNED_MESSAGE_OFFSETS.MSG_START,
        UNSIGNED_MESSAGE_OFFSETS.MSG_START + msgLen,
    );
}

/**
 * Returns the inner payload bytes of an AddressedCall, or `null` if the
 * blob is malformed.
 *
 * AddressedCall layout:
 *   codec(2) | typeID(4) | srcAddrLen(4) | srcAddr(N) | payloadLen(4) | payload(M)
 */
export function readPayloadFromAddressedCall(addressedCall: Uint8Array): Uint8Array | null {
    if (addressedCall.length < ADDRESSED_CALL_OFFSETS.SRC_ADDR) return null;
    const dv = new DataView(addressedCall.buffer, addressedCall.byteOffset, addressedCall.byteLength);
    const srcAddrLen = dv.getUint32(ADDRESSED_CALL_OFFSETS.SRC_ADDR_LEN, false);
    const payloadLenPos = ADDRESSED_CALL_OFFSETS.SRC_ADDR + srcAddrLen;
    if (payloadLenPos + 4 > addressedCall.length) return null;
    const payloadLen = dv.getUint32(payloadLenPos, false);
    if (payloadLen <= 0) return null;
    const start = payloadLenPos + 4;
    const end = start + payloadLen;
    if (end > addressedCall.length) return null;
    return addressedCall.slice(start, end);
}

/**
 * Returns the AddressedCall typeID without unpacking the full payload.
 * Returns `null` if the blob is too short to contain a typeID.
 */
export function readAddressedCallTypeId(addressedCall: Uint8Array): number | null {
    if (addressedCall.length < ADDRESSED_CALL_OFFSETS.SRC_ADDR_LEN) return null;
    return new DataView(
        addressedCall.buffer,
        addressedCall.byteOffset,
        addressedCall.byteLength,
    ).getUint32(ADDRESSED_CALL_OFFSETS.TYPE_ID, false);
}
