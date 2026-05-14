import { Bool, Id, pvmSerial, utils } from "@avalabs/avalanchejs";

import { encodeWithCodec, parseWithAddressedCallFallback, throwNoDirectFromBytes } from "../_codec";

const Schema = pvmSerial.warp.AddressedCallPayloads.L1ValidatorRegistrationMessage;

/**
 * Parses a L1ValidatorRegistrationMessage from a hex string. Accepts the
 * inner payload or any wrapping (AddressedCall, UnsignedMessage, WarpMessage).
 */
export function parseL1ValidatorRegistrationMessage(
    hex: string,
): L1ValidatorRegistrationMessage {
    return parseWithAddressedCallFallback(
        hex,
        Schema,
        (u) => new L1ValidatorRegistrationMessage(u.validationId, u.registered),
        parseL1ValidatorRegistrationMessage,
    );
}

/**
 * Creates a new L1ValidatorRegistrationMessage.
 *
 * @param validationId - The validation ID (base58check encoded).
 * @param registered - Whether the validator is registered.
 */
export function newL1ValidatorRegistrationMessage(validationId: string, registered: boolean) {
    return new L1ValidatorRegistrationMessage(
        new Id(utils.base58check.decode(validationId)),
        new Bool(registered),
    );
}

export class L1ValidatorRegistrationMessage extends Schema {
    static fromHex(hex: string) {
        return parseL1ValidatorRegistrationMessage(hex);
    }

    static fromValues(validationId: string, registered: boolean) {
        return newL1ValidatorRegistrationMessage(validationId, registered);
    }

    toHex() {
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex` / `fromValues`. */
    static override fromBytes(_b: never, _c: never): [L1ValidatorRegistrationMessage, Uint8Array] {
        return throwNoDirectFromBytes("L1ValidatorRegistrationMessage");
    }
}
