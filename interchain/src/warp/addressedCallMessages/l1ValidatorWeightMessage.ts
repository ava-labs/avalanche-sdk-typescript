import { BigIntPr, Id, pvmSerial, utils } from "@avalabs/avalanchejs";

import { encodeWithCodec, parseWithAddressedCallFallback, throwNoDirectFromBytes } from "../_codec";

const Schema = pvmSerial.warp.AddressedCallPayloads.L1ValidatorWeightMessage;

/**
 * Parses a L1ValidatorWeightMessage from a hex string. Accepts the inner
 * payload or any wrapping (AddressedCall, UnsignedMessage, WarpMessage).
 */
export function parseL1ValidatorWeightMessage(hex: string): L1ValidatorWeightMessage {
    return parseWithAddressedCallFallback(
        hex,
        Schema,
        (u) => new L1ValidatorWeightMessage(u.validationId, u.nonce, u.weight),
        parseL1ValidatorWeightMessage,
    );
}

/**
 * Creates a new L1ValidatorWeightMessage.
 *
 * @param validationId - The validation ID (base58check encoded).
 * @param nonce - The nonce as a bigint.
 * @param weight - The weight of the validator as a bigint.
 */
export function newL1ValidatorWeightMessage(validationId: string, nonce: bigint, weight: bigint) {
    return new L1ValidatorWeightMessage(
        new Id(utils.base58check.decode(validationId)),
        new BigIntPr(nonce),
        new BigIntPr(weight),
    );
}

export class L1ValidatorWeightMessage extends Schema {
    static fromHex(hex: string) {
        return parseL1ValidatorWeightMessage(hex);
    }

    static fromValues(validationId: string, nonce: bigint, weight: bigint) {
        return newL1ValidatorWeightMessage(validationId, nonce, weight);
    }

    toHex() {
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex` / `fromValues`. */
    static override fromBytes(_b: never, _c: never): [L1ValidatorWeightMessage, Uint8Array] {
        return throwNoDirectFromBytes("L1ValidatorWeightMessage");
    }
}
