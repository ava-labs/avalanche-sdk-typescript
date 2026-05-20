import { Address, Bytes, pvmSerial, utils } from "@avalabs/avalanchejs";

import {
    ADDRESSED_CALL_OFFSETS,
    ADDRESSED_CALL_TYPE_ID,
    WARP_CODEC_ID,
} from "./constants";
import { encodeWithCodec, throwNoDirectFromBytes } from "./serialization";
import { concatBytes, evmOrBech32AddressToBytes, readU16, readU32, u16, u32 } from "./utils";
import { parseWarpMessage } from "./warpMessage";
import { parseWarpUnsignedMessage } from "./warpUnsignedMessage";

const warpManager = pvmSerial.warp.getWarpManager();
const Schema = pvmSerial.warp.AddressedCallPayloads.AddressedCall;

/**
 * Build the canonical AddressedCall bytes for a *system* source (no sender):
 *   codecID(uint16=0) | typeID(uint32=1) | sourceAddrLen(uint32=0) | payloadLen(uint32) | payload
 *
 * avalanchejs's `Address` serializes a fixed 20-byte source field — passing an
 * empty input pads to 20 zero bytes, which emits `sourceAddrLen=20` instead
 * of the canonical `sourceAddrLen=0`. P-Chain and L1 validators sign the
 * variable-length form; the 20-byte form produces a different message hash
 * and the signature aggregator will not converge.
 *
 * Exported because the AddressedCall class falls back to this when its
 * source-address was constructed empty.
 */
export function buildSystemSourceAddressedCallHex(payloadHex: string): string {
    const payloadBytes = utils.hexToBuffer(payloadHex);
    return utils.bufferToHex(
        concatBytes(
            u16(WARP_CODEC_ID),
            u32(ADDRESSED_CALL_TYPE_ID),
            u32(0),
            u32(payloadBytes.length),
            payloadBytes,
        ),
    );
}

/**
 * Returns `true` iff `hex` decodes as a canonical AddressedCall with
 * `sourceAddrLen == 0` (i.e. system source). Used to detect the empty-source
 * case BEFORE avalanchejs's Schema.unpack tries to read a fixed-length
 * Address field.
 */
function isSystemSourceAddressedCallHex(hex: string): boolean {
    let bytes: Uint8Array;
    try {
        bytes = utils.hexToBuffer(hex);
    } catch {
        return false;
    }
    if (bytes.length < ADDRESSED_CALL_OFFSETS.SRC_ADDR) return false;
    const codec = readU16(bytes, ADDRESSED_CALL_OFFSETS.CODEC);
    const typeId = readU32(bytes, ADDRESSED_CALL_OFFSETS.TYPE_ID);
    const srcAddrLen = readU32(bytes, ADDRESSED_CALL_OFFSETS.SRC_ADDR_LEN);
    return codec === WARP_CODEC_ID && typeId === ADDRESSED_CALL_TYPE_ID && srcAddrLen === 0;
}

/**
 * Parse an AddressedCall payload from hex, accepting either the inner
 * payload or any of its wrappings:
 *
 *   1. raw AddressedCall (try direct unpack first)
 *   2. UnsignedMessage containing an AddressedCall
 *   3. fully signed WarpMessage → UnsignedMessage → AddressedCall
 *
 * System-source AddressedCalls (`sourceAddrLen=0`) bypass avalanchejs's
 * fixed-20-byte Address unpack — we read the payload bytes directly so the
 * resulting object's `toHex()` round-trips to the same canonical form.
 */
export function parseAddressedCallPayload(hex: string): AddressedCall {
    if (isSystemSourceAddressedCallHex(hex)) {
        const bytes = utils.hexToBuffer(hex);
        const payloadLenPos = ADDRESSED_CALL_OFFSETS.SRC_ADDR + 0; // srcAddrLen=0
        const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const payloadLen = dv.getUint32(payloadLenPos, false);
        const payloadStart = payloadLenPos + 4;
        const payloadBytes = bytes.slice(payloadStart, payloadStart + payloadLen);
        const ac = new AddressedCall(
            new Address(new Uint8Array(0)),
            new Bytes(payloadBytes),
        );
        ac._systemSourceHexOverride = hex;
        return ac;
    }

    try {
        const parsed = warpManager.unpack(utils.hexToBuffer(hex), Schema);
        return new AddressedCall(parsed.sourceAddress, parsed.payload);
    } catch {
        try {
            const unsignedMsg = parseWarpUnsignedMessage(hex);
            return parseAddressedCallPayload(unsignedMsg.payload.toString("hex"));
        } catch {
            const warpMsg = parseWarpMessage(hex);
            return parseAddressedCallPayload(warpMsg.unsignedMessage.payload.toString("hex"));
        }
    }
}

/**
 * Creates a new AddressedCall from values.
 *
 * @param sourceAddress - Source address (EVM or Bech32). Pass `""` or `"0x"`
 *                       for system-source messages (no sender) — the
 *                       resulting AddressedCall's `toHex()` emits the
 *                       canonical zero-length-source form, not avalanchejs's
 *                       padded-to-20-bytes form (which would change the
 *                       warp message hash).
 * @param payloadHex - The inner payload as a hex string.
 */
export function newAddressedCallPayload(sourceAddress: string, payloadHex: string) {
    if (sourceAddress === "" || sourceAddress === "0x") {
        const ac = new AddressedCall(
            new Address(new Uint8Array(0)),
            new Bytes(utils.hexToBuffer(payloadHex)),
        );
        ac._systemSourceHexOverride = buildSystemSourceAddressedCallHex(payloadHex);
        return ac;
    }
    return new AddressedCall(
        new Address(evmOrBech32AddressToBytes(sourceAddress)),
        new Bytes(utils.hexToBuffer(payloadHex)),
    );
}

export class AddressedCall extends Schema {
    /**
     * @internal Set by {@link newAddressedCallPayload} and
     * {@link parseAddressedCallPayload} when the message has no sender
     * (`sourceAddrLen=0`). avalanchejs's serializer would re-emit a padded
     * 20-byte Address for that case, producing a different message hash
     * than the validators signed.
     */
    _systemSourceHexOverride?: string;

    static fromHex(hex: string): AddressedCall {
        return parseAddressedCallPayload(hex);
    }

    static fromValues(sourceAddress: string, payloadHex: string) {
        return newAddressedCallPayload(sourceAddress, payloadHex);
    }

    toHex() {
        if (this._systemSourceHexOverride) return this._systemSourceHexOverride;
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex` / `fromValues`. */
    static override fromBytes(_b: never, _c: never): [AddressedCall, Uint8Array] {
        return throwNoDirectFromBytes("AddressedCall");
    }
}
