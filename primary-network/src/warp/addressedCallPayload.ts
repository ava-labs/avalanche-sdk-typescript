import { utils, pvmSerial, Address, Bytes, Short } from "@avalabs/avalanchejs";
import { parseWarpMessage } from "./warpMessage";
import { evmOrBech32AddressToBytes } from "./utils";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseAddressedCallPayload(
    addressedCallPayloadHex: string,
): AddressedCall {
    try {
        const parsedAddressedCallPayload = warpManager.unpack(
            utils.hexToBuffer(addressedCallPayloadHex),
            pvmSerial.warp.AddressedCallPayloads.AddressedCall,
        );
        return new AddressedCall(
            parsedAddressedCallPayload.sourceAddress,
            parsedAddressedCallPayload.payload
        );
    } catch (error) {
        const warpMsg = parseWarpMessage(addressedCallPayloadHex);
        const addressedCallPayload = parseAddressedCallPayload(
            warpMsg.unsignedMessage.payload.toString('hex'),
        );
        return addressedCallPayload;
    }
}

export function newAddressedCallPayload(sourceAddress: string, payloadHex: string) {
    const sourceAddressBytes = evmOrBech32AddressToBytes(sourceAddress);
    const payloadBytes = utils.hexToBuffer(payloadHex);
    return new AddressedCall(new Address(sourceAddressBytes), new Bytes(payloadBytes));
}

export class AddressedCall extends pvmSerial.warp.AddressedCallPayloads.AddressedCall {
    static fromHex(addressedCallPayloadHex: string): AddressedCall {
        return parseAddressedCallPayload(addressedCallPayloadHex);
    }

    static fromValues(sourceAddress: string, payloadHex: string) {
        return newAddressedCallPayload(sourceAddress, payloadHex);
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
    ): [AddressedCall, Uint8Array] {
        throw new Error('Do not use `AddressedCall.fromBytes` method directly.');
    }
}