import { Id, pvmSerial, utils } from "@avalabs/avalanchejs";

import { encodeWithCodec, parseWithAddressedCallFallback, throwNoDirectFromBytes } from "../_codec";

const Schema = pvmSerial.warp.AddressedCallPayloads.SubnetToL1ConversionMessage;

/**
 * Parses a SubnetToL1ConversionMessage (AddressedCall payload) from a hex string.
 *
 * Accepts the inner payload, or any of the AddressedCall / UnsignedMessage /
 * signed WarpMessage wrappings around it.
 */
export function parseSubnetToL1ConversionMessage(hex: string): SubnetToL1ConversionMessage {
    return parseWithAddressedCallFallback(
        hex,
        Schema,
        (u) => new SubnetToL1ConversionMessage(u.conversionId),
        parseSubnetToL1ConversionMessage,
    );
}

/**
 * Creates a new SubnetToL1ConversionMessage from a conversion ID.
 *
 * @param conversionId - The conversion ID (base58check encoded).
 */
export function newSubnetToL1ConversionMessage(conversionId: string) {
    return new SubnetToL1ConversionMessage(new Id(utils.base58check.decode(conversionId)));
}

export class SubnetToL1ConversionMessage extends Schema {
    static fromHex(hex: string) {
        return parseSubnetToL1ConversionMessage(hex);
    }

    static fromValues(conversionId: string) {
        return newSubnetToL1ConversionMessage(conversionId);
    }

    toHex() {
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex` / `fromValues`. */
    static override fromBytes(_b: never, _c: never): [SubnetToL1ConversionMessage, Uint8Array] {
        return throwNoDirectFromBytes("SubnetToL1ConversionMessage");
    }
}
