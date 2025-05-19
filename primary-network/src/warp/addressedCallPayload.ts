import { utils, pvmSerial } from "@avalabs/avalanchejs";
import { parseWarpMessage } from "./warpMessage";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseAddressedCallPayload(
    addressedCallPayloadHex: string,
): AddressedCall {
    const payloadHex = utils.strip0x(addressedCallPayloadHex);

    try {
        const parsedAddressedCallPayload = warpManager.unpack(
            utils.hexToBuffer(payloadHex),
            pvmSerial.warp.AddressedCallPayloads.AddressedCall,
        );
        return parsedAddressedCallPayload;
    } catch (error) {
        const warpMsg = parseWarpMessage(payloadHex);
        const addressedCallPayload = parseAddressedCallPayload(
            warpMsg.unsignedMessage.payload.toString('hex'),
        );
        return addressedCallPayload;
    }
}

export class AddressedCall extends pvmSerial.warp.AddressedCallPayloads.AddressedCall {
    static fromHex(addressedCallPayloadHex: string): AddressedCall {
        return parseAddressedCallPayload(addressedCallPayloadHex);
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