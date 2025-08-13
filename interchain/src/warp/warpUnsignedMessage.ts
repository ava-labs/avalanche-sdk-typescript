import { utils, pvmSerial, Int, Id, Bytes, Short } from "@avalabs/avalanchejs";
import { parseWarpMessage } from "./warpMessage";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a Warp unsigned or signed message from a hex string.
 *
 * @param unsignedMsgHex - The hex string representing the unsigned or signed message.
 * @returns The parsed WarpUnsignedMessage instance. {@link WarpUnsignedMessage}
 */
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

/**
 * Creates a new WarpUnsignedMessage from values.
 *
 * @param networkId - The Avalanche network ID.
 * @param sourceChainId - The source blockchain ID.
 * @param payloadHex - The warp message payload as a hex string.
 * @returns A new WarpUnsignedMessage instance. {@link WarpUnsignedMessage}
 */
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

/**
 * WarpUnsignedMessage class provides utility methods to build
 * and parse unsigned warp message from hex strings or values, and
 * access its properties.
 */
export class WarpUnsignedMessage extends pvmSerial.warp.WarpUnsignedMessage {
    /**
     * Creates a WarpUnsignedMessage instance from a hex string.
     * @param unsignedMsgHex - The hex string representing the unsigned message.
     * @returns The parsed WarpUnsignedMessage instance. {@link WarpUnsignedMessage}
     */
    static fromHex(unsignedMsgHex: string) {
        return parseWarpUnsignedMessage(unsignedMsgHex);
    }

    /**
     * Creates a WarpUnsignedMessage instance from values.
     * @param networkId - The Avalanche network ID.
     * @param sourceChainId - The source chain ID (base58check encoded).
     * @param payloadHex - The payload as a hex string.
     * @returns A new WarpUnsignedMessage instance. {@link WarpUnsignedMessage}
     */
    static fromValues(
        networkId: number,
        sourceChainId: string,
        payloadHex: string,
    ) {
        return newWarpUnsignedMessage(networkId, sourceChainId, payloadHex);
    }

    /**
     * Serializes the WarpUnsignedMessage to a hex string.
     * @returns The hex string representation of the message.
     */
    toHex() {
        const bytesWithoutCodec = this.toBytes(pvmSerial.warp.codec)
        const codecBytes = new Short(0)
        return utils.bufferToHex(Buffer.concat([codecBytes.toBytes(), bytesWithoutCodec]));
    }

    /**
     * Do not use this method directly.
     * Throws an error if called.
     * @throws Error
     */
    static override fromBytes(
        _bytes: never,
        _codec: never
    ): [WarpUnsignedMessage, Uint8Array] {
        throw new Error('Do not use `WarpUnsignedMessage.fromBytes` method directly.');
    }
}
