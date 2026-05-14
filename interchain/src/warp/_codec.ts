import { pvmSerial, Short, utils } from "@avalabs/avalanchejs";

import { parseAddressedCallPayload } from "./addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

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
