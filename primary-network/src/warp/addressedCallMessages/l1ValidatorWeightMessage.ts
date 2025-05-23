import { BigIntPr, Id, pvmSerial, Short, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseL1ValidatorWeightMessage(
    l1ValidatorWeightMessageHex: string,
): L1ValidatorWeightMessage {
    try {
        const parsedL1ValidatorWeightMessage = warpManager.unpack(
            utils.hexToBuffer(l1ValidatorWeightMessageHex),
            pvmSerial.warp.AddressedCallPayloads.L1ValidatorWeightMessage,
        );
        return new L1ValidatorWeightMessage(
            parsedL1ValidatorWeightMessage.validationId,
            parsedL1ValidatorWeightMessage.nonce,
            parsedL1ValidatorWeightMessage.weight
        );
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(l1ValidatorWeightMessageHex);
        const l1ValidatorWeightMessage = parseL1ValidatorWeightMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return l1ValidatorWeightMessage;
    }
}

export function newL1ValidatorWeightMessage(validationId: string, nonce: bigint, weight: bigint) {
    const validationIdBytes = utils.base58check.decode(validationId);
    return new L1ValidatorWeightMessage(
        new Id(validationIdBytes),
        new BigIntPr(nonce),
        new BigIntPr(weight)
    );
}

export class L1ValidatorWeightMessage extends pvmSerial.warp.AddressedCallPayloads.L1ValidatorWeightMessage {
    static fromHex(l1ValidatorWeightMessageHex: string) {
        return parseL1ValidatorWeightMessage(l1ValidatorWeightMessageHex);
    }

    static fromValues(validationId: string, nonce: bigint, weight: bigint) {
        return newL1ValidatorWeightMessage(validationId, nonce, weight);
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
    ): [L1ValidatorWeightMessage, Uint8Array] {
        throw new Error('Do not use `L1ValidatorWeightMessage.fromBytes` method directly.');
    }
}
