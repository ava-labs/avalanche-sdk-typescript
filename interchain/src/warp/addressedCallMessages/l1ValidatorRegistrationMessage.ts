import { Id, Bool, pvmSerial, utils, Short } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a L1ValidatorRegistrationMessage (AddressedCall payload) from a hex string.
 *
 * @param l1ValidatorRegistrationMessageHex - The hex string representing the L1ValidatorRegistrationMessage.
 * @returns The parsed L1ValidatorRegistrationMessage instance. {@link L1ValidatorRegistrationMessage}
 */
export function parseL1ValidatorRegistrationMessage(
    l1ValidatorRegistrationMessageHex: string,
): L1ValidatorRegistrationMessage {
    try {
        const parsedL1ValidatorRegistrationMessage = warpManager.unpack(
            utils.hexToBuffer(l1ValidatorRegistrationMessageHex),
            pvmSerial.warp.AddressedCallPayloads.L1ValidatorRegistrationMessage,
        );
        return new L1ValidatorRegistrationMessage(
            parsedL1ValidatorRegistrationMessage.validationId,
            parsedL1ValidatorRegistrationMessage.registered,
        );
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(l1ValidatorRegistrationMessageHex);
        const l1ValidatorRegistrationMessage = parseL1ValidatorRegistrationMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return l1ValidatorRegistrationMessage;
    }
}

/**
 * Creates a new L1ValidatorRegistrationMessage from values.
 *
 * @param validationId - The validation ID (base58check encoded).
 * @param registered - The registration status as a boolean.
 * @returns A new L1ValidatorRegistrationMessage instance. {@link L1ValidatorRegistrationMessage}
 */
export function newL1ValidatorRegistrationMessage(
    validationId: string,
    registered: boolean,
) {
    const validationIdBytes = utils.base58check.decode(validationId);
    return new L1ValidatorRegistrationMessage(
        new Id(validationIdBytes),
        new Bool(registered),
    );
}

/**
 * L1ValidatorRegistrationMessage class provides utility methods to build
 * and parse L1ValidatorRegistrationMessage from hex strings or values, and
 * access its properties.
 */
export class L1ValidatorRegistrationMessage extends pvmSerial.warp.AddressedCallPayloads.L1ValidatorRegistrationMessage {
    static fromHex(l1ValidatorRegistrationMessageHex: string) {
        return parseL1ValidatorRegistrationMessage(l1ValidatorRegistrationMessageHex);
    }

    static fromValues(
        validationId: string,
        registered: boolean,
    ) {
        return newL1ValidatorRegistrationMessage(validationId, registered);
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
    ): [L1ValidatorRegistrationMessage, Uint8Array] {
        throw new Error('Do not use `L1ValidatorRegistrationMessage.fromBytes` method directly.');
    }
}
