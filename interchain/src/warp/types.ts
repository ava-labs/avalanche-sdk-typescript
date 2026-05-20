export type PChainOwner = {
    threshold: number;
    addresses: string[];
}

export type ValidatorData = {
    nodeId: string,
    blsPublicKey: string,
    weight: bigint,
}

/**
 * Structural shape of a validator entry as returned by avalanchejs's
 * `pvmSerial.warp.AddressedCallPayloads.ValidatorData` after unpack.
 *
 * avalanchejs's serializables don't expose strict TS types on their
 * fields, so we narrow them locally via this `{ toBytes(): Uint8Array }`
 * trick wherever we want canonical bytes (e.g. when building the wire
 * layout in `conversionData.ts` or the contract struct in
 * `validator-manager/initializeValidatorSet.ts`).
 */
export interface SerializedValidatorEntry {
    nodeId: { toBytes(): Uint8Array };
    blsPublicKey: { toBytes(): Uint8Array };
    weight: { toBytes(): Uint8Array };
}
