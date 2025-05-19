import { pvmSerial, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseL1ValidatorRegistrationMessage(
    l1ValidatorRegistrationMessageHex: string,
): pvmSerial.warp.AddressedCallPayloads.L1ValidatorRegistrationMessage {
    const msgHex = utils.strip0x(l1ValidatorRegistrationMessageHex);

    try {
        const parsedL1ValidatorRegistrationMessage = warpManager.unpack(
            utils.hexToBuffer(msgHex),
            pvmSerial.warp.AddressedCallPayloads.L1ValidatorRegistrationMessage,
        );
        return parsedL1ValidatorRegistrationMessage;
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(msgHex);
        const l1ValidatorRegistrationMessage = parseL1ValidatorRegistrationMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return l1ValidatorRegistrationMessage;
    }
}

export class L1ValidatorRegistrationMessage extends pvmSerial.warp.AddressedCallPayloads.L1ValidatorRegistrationMessage {
    static fromHex(l1ValidatorRegistrationMessageHex: string) {
        return parseL1ValidatorRegistrationMessage(l1ValidatorRegistrationMessageHex);
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
