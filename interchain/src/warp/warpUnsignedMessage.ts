import { Bytes, Id, Int, pvmSerial, utils } from "@avalabs/avalanchejs";

import { encodeWithCodec, throwNoDirectFromBytes } from "./serialization";
import { parseWarpMessage } from "./warpMessage";

const warpManager = pvmSerial.warp.getWarpManager();
const Schema = pvmSerial.warp.WarpUnsignedMessage;

/**
 * Parses a Warp unsigned or signed message from a hex string.
 *
 * Accepts an UnsignedMessage directly or unwraps a signed WarpMessage.
 */
export function parseWarpUnsignedMessage(hex: string): WarpUnsignedMessage {
    try {
        const parsed = warpManager.unpack(utils.hexToBuffer(hex), Schema);
        return new WarpUnsignedMessage(parsed.networkId, parsed.sourceChainId, parsed.payload);
    } catch {
        const warpMsg = parseWarpMessage(hex);
        return parseWarpUnsignedMessage(warpMsg.unsignedMessage.payload.toString("hex"));
    }
}

/**
 * Creates a new WarpUnsignedMessage from values.
 *
 * @param networkId - The Avalanche network ID.
 * @param sourceChainId - The source blockchain ID (base58check encoded).
 * @param payloadHex - The warp message payload as a hex string.
 */
export function newWarpUnsignedMessage(networkId: number, sourceChainId: string, payloadHex: string) {
    return new WarpUnsignedMessage(
        new Int(networkId),
        new Id(utils.base58check.decode(sourceChainId)),
        new Bytes(utils.hexToBuffer(payloadHex)),
    );
}

export class WarpUnsignedMessage extends Schema {
    static fromHex(hex: string) {
        return parseWarpUnsignedMessage(hex);
    }

    static fromValues(networkId: number, sourceChainId: string, payloadHex: string) {
        return newWarpUnsignedMessage(networkId, sourceChainId, payloadHex);
    }

    toHex() {
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex` / `fromValues`. */
    static override fromBytes(_b: never, _c: never): [WarpUnsignedMessage, Uint8Array] {
        return throwNoDirectFromBytes("WarpUnsignedMessage");
    }
}
