import { pvmSerial, utils } from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";

const warpManager = pvmSerial.warp.getWarpManager();

export function parseRegisterL1ValidatorMessage(
    registerL1ValidatorMessageHex: string,
): pvmSerial.warp.AddressedCallPayloads.RegisterL1ValidatorMessage {
    const msgHex = utils.strip0x(registerL1ValidatorMessageHex);

    try {
        const parsedRegisterL1ValidatorMessage = warpManager.unpack(
            utils.hexToBuffer(msgHex),
            pvmSerial.warp.AddressedCallPayloads.RegisterL1ValidatorMessage,
        );
        return parsedRegisterL1ValidatorMessage;
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(msgHex);
        const registerL1ValidatorMessage = parseRegisterL1ValidatorMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return registerL1ValidatorMessage;
    }
}

export class RegisterL1ValidatorMessage extends pvmSerial.warp.AddressedCallPayloads.RegisterL1ValidatorMessage {
    static fromHex(registerL1ValidatorMessageHex: string) {
        return parseRegisterL1ValidatorMessage(registerL1ValidatorMessageHex);
    }

    /**
     * Do not use this method directly.
     */
    static override fromBytes(
        _bytes: never,
        _codec: never
    ): [RegisterL1ValidatorMessage, Uint8Array] {
        throw new Error('Do not use `RegisterL1ValidatorMessage.fromBytes` method directly.');
    }
}
