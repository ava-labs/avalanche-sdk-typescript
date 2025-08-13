import { Id, pvmSerial, Short, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a SubnetToL1ConversionMessage (AddressedCall payload) from a hex string.
 *
 * @param subnetToL1ConversionMessageHex - The hex string representing the SubnetToL1ConversionMessage.
 * @returns The parsed SubnetToL1ConversionMessage instance. {@link SubnetToL1ConversionMessage}
 */
export function parseSubnetToL1ConversionMessage(
    subnetToL1ConversionMessageHex: string,
): SubnetToL1ConversionMessage {
    try {
        const parsedSubnetToL1ConversionMessage = warpManager.unpack(
            utils.hexToBuffer(subnetToL1ConversionMessageHex),
            pvmSerial.warp.AddressedCallPayloads.SubnetToL1ConversionMessage,
        );
        return new SubnetToL1ConversionMessage(
            parsedSubnetToL1ConversionMessage.conversionId,
        );
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(subnetToL1ConversionMessageHex);
        const subnetToL1ConversionMessage = parseSubnetToL1ConversionMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return subnetToL1ConversionMessage;
    }
}

/**
 * Creates a new SubnetToL1ConversionMessage from a conversion ID.
 *
 * @param conversionId - The conversion ID (base58check encoded).
 * @returns A new SubnetToL1ConversionMessage instance. {@link SubnetToL1ConversionMessage}
 */
export function newSubnetToL1ConversionMessage(
    conversionId: string,
) {
    const conversionIdBytes = utils.base58check.decode(conversionId);
    return new SubnetToL1ConversionMessage(
        new Id(conversionIdBytes),
    )
}

/**
 * SubnetToL1ConversionMessage class provides utility methods to build
 * and parse SubnetToL1ConversionMessage from hex strings or values, and
 * access its properties.
 */
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
