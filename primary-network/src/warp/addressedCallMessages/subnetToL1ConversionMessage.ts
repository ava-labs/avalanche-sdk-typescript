import { pvmSerial, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseSubnetToL1ConversionMessage(
    subnetToL1ConversionMessageHex: string,
): pvmSerial.warp.AddressedCallPayloads.SubnetToL1ConversionMessage {
    const msgHex = utils.strip0x(subnetToL1ConversionMessageHex);

    try {
        const parsedSubnetToL1ConversionMessage = warpManager.unpack(
            utils.hexToBuffer(msgHex),
            pvmSerial.warp.AddressedCallPayloads.SubnetToL1ConversionMessage,
        );
        return parsedSubnetToL1ConversionMessage;
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(msgHex);
        const subnetToL1ConversionMessage = parseSubnetToL1ConversionMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return subnetToL1ConversionMessage;
    }
}

export class SubnetToL1ConversionMessage extends pvmSerial.warp.AddressedCallPayloads.SubnetToL1ConversionMessage {
    static fromHex(subnetToL1ConversionMessageHex: string) {
        return parseSubnetToL1ConversionMessage(subnetToL1ConversionMessageHex);
    }

    /**
     * Do not use this method directly.
     */
    static override fromBytes(
        _bytes: never,
        _codec: never
    ): [SubnetToL1ConversionMessage, Uint8Array] {
        throw new Error('Do not use `SubnetToL1ConversionMessage.fromBytes` method directly.');
    }
}
