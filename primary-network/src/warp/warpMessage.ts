import { pvmSerial, utils } from "@avalabs/avalanchejs";

export type DoNotUseOverride<T> = T extends never ? never : never;

const warpManager = pvmSerial.warp.getWarpManager();

export function parseWarpMessage(warpMsgHex: string): WarpMessage {
    const msgHex = utils.strip0x(warpMsgHex);

    const parsedWarpMsg = warpManager.unpack(
        utils.hexToBuffer(msgHex),
        pvmSerial.warp.WarpMessage,
    );

    return parsedWarpMsg;
}

export class WarpMessage extends pvmSerial.warp.WarpMessage {
    static fromHex(warpMsgHex: string) {
        return parseWarpMessage(warpMsgHex);
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
