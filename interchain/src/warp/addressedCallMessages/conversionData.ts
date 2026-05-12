import { Address, BigIntPr, BlsPublicKey, Id, NodeId, pvmSerial, Short, utils } from "@avalabs/avalanchejs";
import type { ValidatorData as ValidatorDataRaw } from "../types";
import { sha256 } from "@noble/hashes/sha2";
import { nodeIdToBytes } from "../utils";

const warpManager = pvmSerial.warp.getWarpManager();

/**
 * Parses a ConversionData (SubnetToL1Conversion) from a hex string.
 *
 * @param conversionDataHex - The hex string representing the ConversionData.
 * @returns The parsed ConversionData instance. {@link ConversionData}
 */
export function parseConversionData(
    conversionDataHex: string,
): ConversionData {
    const parsedConversionData = warpManager.unpack(
        utils.hexToBuffer(conversionDataHex),
        pvmSerial.warp.AddressedCallPayloads.ConversionData,
    );
    return new ConversionData(
        parsedConversionData.subnetId,
        parsedConversionData.managerChainId,
        parsedConversionData.managerAddress,
        parsedConversionData.validators,
    );
}

/**
 * Creates a new ConversionData from values.
 *
 * @param subnetId - The subnet ID (base58check encoded).
 * @param managerChainId - The manager chain ID (base58check encoded).
 * @param managerAddress - The manager address in Bech32 format.
 * @param validators - An array of validator data.
 * @param validators.nodeId - The node ID (base58check encoded).
 * @param validators.blsPublicKey - The BLS public key in hex format.
 * @param validators.weight - The weight of the validator as a bigint.
 * @returns A new ConversionData instance. {@link ConversionData}
 */
export function newConversionData(
    subnetId: string,
    managerChainId: string,
    managerAddress: string,
    validators: ValidatorDataRaw[],
) {
    const subnetIdBytes = utils.base58check.decode(subnetId);
    const managerChainIdBytes = utils.base58check.decode(managerChainId);
    // Avalanche canonical conversion-ID hashing requires validators sorted by raw nodeId bytes ascending.
    const formattedValidators = validators
        .map((vldr) => ({
            nodeIdBytes: nodeIdToBytes(vldr.nodeId),
            blsPublicKey: vldr.blsPublicKey,
            weight: vldr.weight,
        }))
        .sort((a, b) => {
            const len = Math.min(a.nodeIdBytes.length, b.nodeIdBytes.length);
            for (let i = 0; i < len; i++) {
                const ai = a.nodeIdBytes[i] as number;
                const bi = b.nodeIdBytes[i] as number;
                if (ai !== bi) return ai - bi;
            }
            return a.nodeIdBytes.length - b.nodeIdBytes.length;
        })
        .map((vldr) => new pvmSerial.warp.AddressedCallPayloads.ValidatorData(
            new NodeId(vldr.nodeIdBytes),
            BlsPublicKey.fromHex(vldr.blsPublicKey),
            new BigIntPr(vldr.weight),
        ));
    return new ConversionData(
        new Id(subnetIdBytes),
        new Id(managerChainIdBytes),
        Address.fromHex(managerAddress),
        formattedValidators,
    );
}

/**
 * ConversionData class provides utility methods to build
 * and parse ConversionData from hex strings or values, and
 * access its properties.
 */
export class ConversionData extends pvmSerial.warp.AddressedCallPayloads.ConversionData {
    static fromHex(conversionDataHex: string) {
        return parseConversionData(conversionDataHex);
    }

    static fromValues(
        subnetId: string,
        managerChainId: string,
        managerAddress: string,
        validators: ValidatorDataRaw[],
    ) {
        return newConversionData(subnetId, managerChainId, managerAddress, validators);
    }

    /**
     * Canonical Avalanche serialization for `ConversionData`:
     *   codec(2) | subnetID(32) | managerChainID(32) | managerAddrLen(4) | managerAddr
     *   | numValidators(4) | { nodeIDLen(4) | nodeID | blsPubKey(48) | weight(8) }*
     *
     * NOTE: We don't use avalanchejs's `toBytes(codec)` because its generic serializer
     * adds an extra 4-byte length prefix around the validators array. The Avalanche
     * spec — and what the validators actually sign — does not have that prefix.
     */
    toHex(): string {
        const validators = this.validators as Array<{
            nodeId: { toBytes(codec?: unknown): Uint8Array };
            blsPublicKey: { toBytes(codec?: unknown): Uint8Array };
            weight: { toBytes(codec?: unknown): Uint8Array };
        }>;
        const u16 = (n: number) => { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, n, false); return b; };
        const u32 = (n: number) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, false); return b; };
        const subnetIdBytes = (this.subnetId as { toBytes(): Uint8Array }).toBytes();
        const managerChainIdBytes = (this.managerChainId as { toBytes(): Uint8Array }).toBytes();
        const managerAddrBytes = (this.managerAddress as { toBytes(): Uint8Array }).toBytes();
        const parts: Uint8Array[] = [
            u16(0),                             // codec
            subnetIdBytes,                      // 32 bytes
            managerChainIdBytes,                // 32 bytes
            u32(managerAddrBytes.length),       // managerAddress length prefix
            managerAddrBytes,
            u32(validators.length),             // numValidators
        ];
        for (const v of validators) {
            const nodeIdBytes = v.nodeId.toBytes();
            parts.push(u32(nodeIdBytes.length));
            parts.push(nodeIdBytes);
            parts.push(v.blsPublicKey.toBytes());     // 48 bytes, no length prefix
            parts.push(v.weight.toBytes());           // 8 bytes BE uint64
        }
        const total = parts.reduce((s, p) => s + p.length, 0);
        const out = new Uint8Array(total);
        let off = 0;
        for (const p of parts) { out.set(p, off); off += p.length; }
        // Silence unused-import warning for Short; it's still used by sibling classes.
        void Short;
        return utils.bufferToHex(out);
    }

    getConversionId() {
        return utils.bufferToHex(sha256(utils.hexToBuffer(this.toHex())));
    }

    /**
     * Do not use this method directly.
     */
    static override fromBytes(
        _bytes: never,
        _codec: never
    ): [ConversionData, Uint8Array] {
        throw new Error('Do not use `ConversionData.fromBytes` method directly.');
    }
}
