import { Address, Bytes, pvmSerial, utils } from "@avalabs/avalanchejs";

import { encodeWithCodec, throwNoDirectFromBytes } from "./_codec";
import { evmOrBech32AddressToBytes } from "./utils";
import { parseWarpMessage } from "./warpMessage";
import { parseWarpUnsignedMessage } from "./warpUnsignedMessage";

const warpManager = pvmSerial.warp.getWarpManager();
const Schema = pvmSerial.warp.AddressedCallPayloads.AddressedCall;

/**
 * Parse an AddressedCall payload from hex, accepting either the inner
 * payload or any of its wrappings:
 *
 *   1. raw AddressedCall (try direct unpack first)
 *   2. UnsignedMessage containing an AddressedCall
 *   3. fully signed WarpMessage → UnsignedMessage → AddressedCall
 */
export function parseAddressedCallPayload(hex: string): AddressedCall {
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
 *                       for system-source messages (no sender).
 * @param payloadHex - The inner payload as a hex string.
 */
export function newAddressedCallPayload(sourceAddress: string, payloadHex: string) {
    return new AddressedCall(
        new Address(evmOrBech32AddressToBytes(sourceAddress)),
        new Bytes(utils.hexToBuffer(payloadHex)),
    );
}

export class AddressedCall extends Schema {
    static fromHex(hex: string): AddressedCall {
        return parseAddressedCallPayload(hex);
    }

    static fromValues(sourceAddress: string, payloadHex: string) {
        return newAddressedCallPayload(sourceAddress, payloadHex);
    }

    toHex() {
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex` / `fromValues`. */
    static override fromBytes(_b: never, _c: never): [AddressedCall, Uint8Array] {
        return throwNoDirectFromBytes("AddressedCall");
    }
}
