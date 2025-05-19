import { pvmSerial, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseL1ValidatorWeightMessage(
    l1ValidatorWeightMessageHex: string,
): pvmSerial.warp.AddressedCallPayloads.L1ValidatorWeightMessage {
    const msgHex = utils.strip0x(l1ValidatorWeightMessageHex);

    try {
        const parsedL1ValidatorWeightMessage = warpManager.unpack(
            utils.hexToBuffer(msgHex),
            pvmSerial.warp.AddressedCallPayloads.L1ValidatorWeightMessage,
        );
        return parsedL1ValidatorWeightMessage;
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(msgHex);
        const l1ValidatorWeightMessage = parseL1ValidatorWeightMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return l1ValidatorWeightMessage;
    }
}

export class L1ValidatorWeightMessage extends pvmSerial.warp.AddressedCallPayloads.L1ValidatorWeightMessage {
    static fromHex(l1ValidatorWeightMessageHex: string) {
        return parseL1ValidatorWeightMessage(l1ValidatorWeightMessageHex);
    }

    /**
     * Do not use this method directly.
     */
    static override fromBytes(
        _bytes: never,
        _codec: never
    ): [L1ValidatorWeightMessage, Uint8Array] {
        throw new Error('Do not use `L1ValidatorWeightMessage.fromBytes` method directly.');
    }
}
