import {
    BigIntPr,
    BlsPublicKey,
    PChainOwner,
    Id,
    NodeId,
    pvmSerial,
    utils,
    Short,
} from "@avalabs/avalanchejs";
import { parseAddressedCallPayload } from "../addressedCallPayload";
import { parseBech32AddressToBytes } from "../utils";
import type { PChainOwner as PChainOwnerRaw } from "../types";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a RegisterL1ValidatorMessage (AddressedCall payload) from a hex string.
 *
 * @param registerL1ValidatorMessageHex - The hex string representing the RegisterL1ValidatorMessage.
 * @returns The parsed RegisterL1ValidatorMessage instance. {@link RegisterL1ValidatorMessage}
 */
export function parseRegisterL1ValidatorMessage(
    registerL1ValidatorMessageHex: string,
): RegisterL1ValidatorMessage {
    try {
        const parsedRegisterL1ValidatorMessage = warpManager.unpack(
            utils.hexToBuffer(registerL1ValidatorMessageHex),
            pvmSerial.warp.AddressedCallPayloads.RegisterL1ValidatorMessage,
        );
        return new RegisterL1ValidatorMessage(
            parsedRegisterL1ValidatorMessage.subnetId,
            parsedRegisterL1ValidatorMessage.nodeId,
            parsedRegisterL1ValidatorMessage.blsPublicKey,
            parsedRegisterL1ValidatorMessage.expiry,
            parsedRegisterL1ValidatorMessage.remainingBalanceOwner,
            parsedRegisterL1ValidatorMessage.disableOwner,
            parsedRegisterL1ValidatorMessage.weight
        );
    } catch (error) {
        const addressedCallPayload = parseAddressedCallPayload(registerL1ValidatorMessageHex);
        const registerL1ValidatorMessage = parseRegisterL1ValidatorMessage(
            addressedCallPayload.payload.toString('hex'),
        );
        return registerL1ValidatorMessage;
    }
}

/**
 * Creates a new RegisterL1ValidatorMessage from values.
 *
 * @param subnetId - The subnet ID (base58check encoded).
 * @param nodeId - The node ID (base58check encoded).
 * @param blsPublicKey - The BLS public key in hex format.
 * @param expiry - The expiry time as a bigint.
 * @param remainingBalanceOwner - The remaining balance owner details.
 * @param disableOwner - The disable owner details.
 * @param weight - The weight of the validator as a bigint.
 * @returns A new RegisterL1ValidatorMessage instance. {@link RegisterL1ValidatorMessage}
 */
export function newRegisterL1ValidatorMessage(
    subnetId: string,
    nodeId: string,
    blsPublicKey: string,
    expiry: bigint,
    remainingBalanceOwner: PChainOwnerRaw,
    disableOwner: PChainOwnerRaw,
    weight: bigint
) {
    const nodeIdBytes = utils.base58check.decode(nodeId.replace('NodeID-', ''));
    const subnetIdBytes = utils.base58check.decode(subnetId);
    const formattedRemainingBalanceOwner = PChainOwner.fromNative(
        remainingBalanceOwner.addresses.map((address) => parseBech32AddressToBytes(address, 'P')),
        remainingBalanceOwner.threshold
    );
    const formattedDisableOwner = PChainOwner.fromNative(
        disableOwner.addresses.map((address) => parseBech32AddressToBytes(address, 'P')),
        disableOwner.threshold
    );
    return new RegisterL1ValidatorMessage(
        new Id(subnetIdBytes),
        new NodeId(nodeIdBytes),
        BlsPublicKey.fromHex(blsPublicKey),
        new BigIntPr(expiry),
        formattedRemainingBalanceOwner,
        formattedDisableOwner,
        new BigIntPr(weight)
    )
}

/**
 * RegisterL1ValidatorMessage class provides utility methods to build
 * and parse RegisterL1ValidatorMessage from hex strings or values, and
 * access its properties.
 */
export class RegisterL1ValidatorMessage extends pvmSerial.warp.AddressedCallPayloads.RegisterL1ValidatorMessage {
    static fromHex(registerL1ValidatorMessageHex: string) {
        return parseRegisterL1ValidatorMessage(registerL1ValidatorMessageHex);
    }

    static fromValues(
        subnetId: string,
        nodeId: string,
        blsPublicKey: string,
        expiry: bigint,
        remainingBalanceOwner: PChainOwnerRaw,
        disableOwner: PChainOwnerRaw,
        weight: bigint
    ) {
        return newRegisterL1ValidatorMessage(subnetId, nodeId, blsPublicKey, expiry, remainingBalanceOwner, disableOwner, weight);
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
    ): [RegisterL1ValidatorMessage, Uint8Array] {
        throw new Error('Do not use `RegisterL1ValidatorMessage.fromBytes` method directly.');
    }
}
