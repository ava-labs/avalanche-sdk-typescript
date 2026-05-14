import { BigIntPr, BlsPublicKey, Id, NodeId, PChainOwner, pvmSerial, utils } from "@avalabs/avalanchejs";

import { encodeWithCodec, parseWithAddressedCallFallback, throwNoDirectFromBytes } from "../serialization";
import type { PChainOwner as PChainOwnerRaw } from "../types";
import { nodeIdToBytes, parseBech32AddressToBytes } from "../utils";

const Schema = pvmSerial.warp.AddressedCallPayloads.RegisterL1ValidatorMessage;

function buildPChainOwner(o: PChainOwnerRaw): PChainOwner {
    return PChainOwner.fromNative(
        o.addresses.map((a) => parseBech32AddressToBytes(a, "P")),
        o.threshold,
    );
}

/**
 * Parses a RegisterL1ValidatorMessage from a hex string. Accepts the inner
 * payload or any wrapping (AddressedCall, UnsignedMessage, WarpMessage).
 */
export function parseRegisterL1ValidatorMessage(hex: string): RegisterL1ValidatorMessage {
    return parseWithAddressedCallFallback(
        hex,
        Schema,
        (u) =>
            new RegisterL1ValidatorMessage(
                u.subnetId,
                u.nodeId,
                u.blsPublicKey,
                u.expiry,
                u.remainingBalanceOwner,
                u.disableOwner,
                u.weight,
            ),
        parseRegisterL1ValidatorMessage,
    );
}

/**
 * Creates a new RegisterL1ValidatorMessage.
 *
 * @param subnetId - The subnet ID (base58check encoded).
 * @param nodeId - The node ID (any of NodeID-<base58check>, base58check, or 0x-hex).
 * @param blsPublicKey - The BLS public key in hex format.
 * @param expiry - The expiry time as a bigint.
 * @param remainingBalanceOwner - The remaining balance owner details.
 * @param disableOwner - The disable owner details.
 * @param weight - The weight of the validator as a bigint.
 */
export function newRegisterL1ValidatorMessage(
    subnetId: string,
    nodeId: string,
    blsPublicKey: string,
    expiry: bigint,
    remainingBalanceOwner: PChainOwnerRaw,
    disableOwner: PChainOwnerRaw,
    weight: bigint,
) {
    return new RegisterL1ValidatorMessage(
        new Id(utils.base58check.decode(subnetId)),
        new NodeId(nodeIdToBytes(nodeId)),
        BlsPublicKey.fromHex(blsPublicKey),
        new BigIntPr(expiry),
        buildPChainOwner(remainingBalanceOwner),
        buildPChainOwner(disableOwner),
        new BigIntPr(weight),
    );
}

export class RegisterL1ValidatorMessage extends Schema {
    static fromHex(hex: string) {
        return parseRegisterL1ValidatorMessage(hex);
    }

    static fromValues(
        subnetId: string,
        nodeId: string,
        blsPublicKey: string,
        expiry: bigint,
        remainingBalanceOwner: PChainOwnerRaw,
        disableOwner: PChainOwnerRaw,
        weight: bigint,
    ) {
        return newRegisterL1ValidatorMessage(
            subnetId,
            nodeId,
            blsPublicKey,
            expiry,
            remainingBalanceOwner,
            disableOwner,
            weight,
        );
    }

    toHex() {
        return encodeWithCodec(this);
    }

    /** Do not use directly — go via `fromHex` / `fromValues`. */
    static override fromBytes(_b: never, _c: never): [RegisterL1ValidatorMessage, Uint8Array] {
        return throwNoDirectFromBytes("RegisterL1ValidatorMessage");
    }
}
