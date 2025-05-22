import { Id, pvmSerial, Short, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseSubnetToL1ConversionMessage(
    subnetToL1ConversionMessageHex: string,
): SubnetToL1ConversionMessage {
    const msgHex = utils.strip0x(subnetToL1ConversionMessageHex);

    try {
        const parsedSubnetToL1ConversionMessage = warpManager.unpack(
            utils.hexToBuffer(msgHex),
            pvmSerial.warp.AddressedCallPayloads.SubnetToL1ConversionMessage,
        );
        return new SubnetToL1ConversionMessage(
            parsedSubnetToL1ConversionMessage.conversionId,
        );
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(msgHex);
        const subnetToL1ConversionMessage = parseSubnetToL1ConversionMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return subnetToL1ConversionMessage;
    }
}

export function newSubnetToL1ConversionMessage(
    conversionId: string,
) {
    const conversionIdBytes = utils.base58check.decode(conversionId);
    return new SubnetToL1ConversionMessage(
        new Id(conversionIdBytes),
    )
}

export class SubnetToL1ConversionMessage extends pvmSerial.warp.AddressedCallPayloads.SubnetToL1ConversionMessage {
    static fromHex(subnetToL1ConversionMessageHex: string) {
        return parseSubnetToL1ConversionMessage(subnetToL1ConversionMessageHex);
    }

    static fromValues(
        conversionId: string,
    ) {
        return newSubnetToL1ConversionMessage(conversionId);
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
    ): [SubnetToL1ConversionMessage, Uint8Array] {
        throw new Error('Do not use `SubnetToL1ConversionMessage.fromBytes` method directly.');
    }
}
