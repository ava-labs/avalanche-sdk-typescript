import { utils, pvmSerial, Int, Id, Bytes, Short } from "@avalabs/avalanchejs";
import { parseWarpMessage } from "./warpMessage";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseWarpUnsignedMessage(unsignedMsgHex: string): WarpUnsignedMessage {
    try {
        const parsedWarpUnsignedMsg = warpManager.unpack(
            utils.hexToBuffer(unsignedMsgHex),
            pvmSerial.warp.WarpUnsignedMessage,
        );

        return new WarpUnsignedMessage(
            parsedWarpUnsignedMsg.networkId,
            parsedWarpUnsignedMsg.sourceChainId,
            parsedWarpUnsignedMsg.payload
        );
    } catch (error) {
        const warpMsg = parseWarpMessage(unsignedMsgHex);
        const unsignedMsg = parseWarpUnsignedMessage(
            warpMsg.unsignedMessage.payload.toString('hex'),
        );
        return unsignedMsg;
    }
}

export function newWarpUnsignedMessage(
    networkId: number,
    sourceChainId: string,
    payloadHex: string,
) {
    return new WarpUnsignedMessage(
        new Int(networkId),
        new Id(utils.base58check.decode(sourceChainId)),
        new Bytes(utils.hexToBuffer(payloadHex)),
    );
}

export class WarpUnsignedMessage extends pvmSerial.warp.WarpUnsignedMessage {
    static fromHex(unsignedMsgHex: string) {
        return parseWarpUnsignedMessage(unsignedMsgHex);
    }

    static fromValues(
        networkId: number,
        sourceChainId: string,
        payloadHex: string,
    ) {
        return newWarpUnsignedMessage(networkId, sourceChainId, payloadHex);
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
    ): [WarpUnsignedMessage, Uint8Array] {
        throw new Error('Do not use `WarpUnsignedMessage.fromBytes` method directly.');
    }
}
