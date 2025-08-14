import { BigIntPr, Id, pvmSerial, Short, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a L1ValidatorWeightMessage (AddressedCall payload) from a hex string.
 *
 * @param l1ValidatorWeightMessageHex - The hex string representing the L1ValidatorWeightMessage.
 * @returns The parsed L1ValidatorWeightMessage instance. {@link L1ValidatorWeightMessage}
 */
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

/**
 * Creates a new L1ValidatorWeightMessage from values.
 *
 * @param validationId - The validation ID (base58check encoded).
 * @param nonce - The nonce as a bigint.
 * @param weight - The weight of the validator as a bigint.
 * @returns A new L1ValidatorWeightMessage instance. {@link L1ValidatorWeightMessage}
 */
export function newL1ValidatorWeightMessage(validationId: string, nonce: bigint, weight: bigint) {
    const validationIdBytes = utils.base58check.decode(validationId);
    return new L1ValidatorWeightMessage(
        new Id(validationIdBytes),
        new BigIntPr(nonce),
        new BigIntPr(weight)
    );
}

/**
 * L1ValidatorWeightMessage class provides utility methods to build
 * and parse L1ValidatorWeightMessage from hex strings or values, and
 * access its properties.
 */
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
