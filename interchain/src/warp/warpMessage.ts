import { pvmSerial, Short, utils } from "@avalabs/avalanchejs";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a Warp signed message from a hex string.
 *
 * @param warpMsgHex - The hex string representing the signed message.
 * @returns The parsed WarpSignedMessage instance. {@link WarpMessage}
*/
export function parseWarpMessage(warpMsgHex: string): WarpMessage {
    const parsedWarpMsg = warpManager.unpack(
        utils.hexToBuffer(warpMsgHex),
        pvmSerial.warp.WarpMessage,
    );

    return new WarpMessage(
        parsedWarpMsg.unsignedMessage,
        parsedWarpMsg.signature
    );
}

/**
 * WarpSignedMessage class provides utility methods to build
 * and parse signed warp message from hex strings or values, and
 * access its properties.
 */
export class WarpMessage extends pvmSerial.warp.WarpMessage {
    static fromHex(warpMsgHex: string) {
        return parseWarpMessage(warpMsgHex);
    }

    toHex() {
        const bytesWithoutCodec = this.toBytes(pvmSerial.warp.codec)
        const codecBytes = new Short(0)
        return utils.bufferToHex(Buffer.concat([codecBytes.toBytes(), bytesWithoutCodec]));
    }

    /**
     * Do not use this method directly.
     */
    static override fromBytes(
        _bytes: never,
        _codec: never
    ): [WarpMessage, Uint8Array] {
        throw new Error('Do not use `WarpMessage.fromBytes` method directly.');
    }
}
