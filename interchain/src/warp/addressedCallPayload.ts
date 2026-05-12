import { utils, pvmSerial, Address, Bytes, Short } from "@avalabs/avalanchejs";
import { parseWarpMessage } from "./warpMessage";
import { parseWarpUnsignedMessage } from "./warpUnsignedMessage";
import { evmOrBech32AddressToBytes } from "./utils";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a Warp AddressedCall payload from a hex string.
 *
 * @param addressedCallPayloadHex - The hex string representing the AddressedCall payload.
 * @returns The parsed AddressedCall instance. {@link AddressedCall}
 */
export function parseAddressedCallPayload(
    addressedCallPayloadHex: string,
): AddressedCall {
    try {
        const parsedAddressedCallPayload = warpManager.unpack(
            utils.hexToBuffer(addressedCallPayloadHex),
            pvmSerial.warp.AddressedCallPayloads.AddressedCall,
        );
        return new AddressedCall(
            parsedAddressedCallPayload.sourceAddress,
            parsedAddressedCallPayload.payload
        );
    } catch (error) {
        // Fallback: input might be an UnsignedMessage (no signature) wrapping the AddressedCall.
        try {
            const unsignedMsg = parseWarpUnsignedMessage(addressedCallPayloadHex);
            return parseAddressedCallPayload(unsignedMsg.payload.toString('hex'));
        } catch {
            // Final fallback: input is a fully signed WarpMessage.
            const warpMsg = parseWarpMessage(addressedCallPayloadHex);
            return parseAddressedCallPayload(warpMsg.unsignedMessage.payload.toString('hex'));
        }
    }
}

/**
 * Creates a new AddressedCall from values.
 *
 * @param sourceAddress - The source address (EVM or Bech32 format).
 * @param payloadHex - The payload as a hex string.
 * @returns A new AddressedCall instance. {@link AddressedCall}
 */
export function newAddressedCallPayload(sourceAddress: string, payloadHex: string) {
    const sourceAddressBytes = evmOrBech32AddressToBytes(sourceAddress);
    const payloadBytes = utils.hexToBuffer(payloadHex);
    return new AddressedCall(new Address(sourceAddressBytes), new Bytes(payloadBytes));
}

/**
 * AddressedCall class provides utility methods to build
 * and parse AddressedCall payloads from hex strings or values, and
 * access its properties.
 */
export class AddressedCall extends pvmSerial.warp.AddressedCallPayloads.AddressedCall {
    static fromHex(addressedCallPayloadHex: string): AddressedCall {
        return parseAddressedCallPayload(addressedCallPayloadHex);
    }

    static fromValues(sourceAddress: string, payloadHex: string) {
        return newAddressedCallPayload(sourceAddress, payloadHex);
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
    ): [AddressedCall, Uint8Array] {
        throw new Error('Do not use `AddressedCall.fromBytes` method directly.');
    }
}