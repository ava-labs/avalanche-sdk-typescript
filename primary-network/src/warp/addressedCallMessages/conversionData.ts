import { Address, BigIntPr, BlsPublicKey, Id, NodeId, pvmSerial, Short, utils } from "@avalabs/avalanchejs";
import type { ValidatorData as ValidatorDataRaw } from "../types";
import { sha256 } from "@noble/hashes/sha2";

const warpManager = pvmSerial.warp.getWarpManager();

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

export function newConversionData(
    subnetId: string,
    managerChainId: string,
    managerAddress: string,
    validators: ValidatorDataRaw[],
) {
    const subnetIdBytes = utils.base58check.decode(subnetId);
    const managerChainIdBytes = utils.base58check.decode(managerChainId);
    const formattedValidators = validators.map((vldr) => new pvmSerial.warp.AddressedCallPayloads.ValidatorData(
        new NodeId(utils.base58check.decode(vldr.nodeId)),
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

    toHex() {
        const bytesWithoutCodec = this.toBytes(pvmSerial.warp.codec)
        const codecBytes = new Short(0)
        return utils.bufferToHex(Buffer.concat([codecBytes.toBytes(), bytesWithoutCodec]));
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
