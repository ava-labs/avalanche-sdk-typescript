import { pvmSerial, utils } from "@avalabs/avalanchejs";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseConversionData(
    conversionDataHex: string,
): pvmSerial.warp.AddressedCallPayloads.ConversionData {
    const msgHex = utils.strip0x(conversionDataHex);

    const parsedConversionData = warpManager.unpack(
        utils.hexToBuffer(msgHex),
        pvmSerial.warp.AddressedCallPayloads.ConversionData,
    );
    return parsedConversionData;
}

export class ConversionData extends pvmSerial.warp.AddressedCallPayloads.ConversionData {
    static fromHex(conversionDataHex: string) {
        return parseConversionData(conversionDataHex);
    }

    /**
     * Do not use this method directly.
     */
    static override fromBytes(
        _bytes: never,
        _codec: never
    ): [ConversionData, Uint8Array] {
        throw new Error('Do not use `ConversionData.fromBytes` method directly.');
    }
}
