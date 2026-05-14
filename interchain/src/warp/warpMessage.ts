import { pvmSerial, utils } from "@avalabs/avalanchejs";

import { encodeWithCodec, throwNoDirectFromBytes } from "./_codec";

const warpManager = pvmSerial.warp.getWarpManager();
const Schema = pvmSerial.warp.WarpMessage;

/** Parses a fully signed Warp message from a hex string. */
export function parseWarpMessage(hex: string): WarpMessage {
    const parsed = warpManager.unpack(utils.hexToBuffer(hex), Schema);
    return new WarpMessage(parsed.unsignedMessage, parsed.signature);
}

export class WarpMessage extends Schema {
    static fromHex(hex: string) {
        return parseWarpMessage(hex);
    }

    toHex() {
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex`. */
    static override fromBytes(_b: never, _c: never): [WarpMessage, Uint8Array] {
        return throwNoDirectFromBytes("WarpMessage");
    }
}
