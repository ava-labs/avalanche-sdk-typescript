import {
    type Context,
    type pvm,
    Id,
    Int,
    OutputOwners,
    Utxo,
    avaxSerial,
    BigIntPr,
    TransferOutput,
    Address,
    Common,
} from '@avalabs/avalanchejs';
import { pAddressForTest } from './accounts';

export const testContext: Context.Context = {
    xBlockchainID: '2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM',
    pBlockchainID: '11111111111111111111111111111111LpoYY',
    cBlockchainID: '2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5',
    avaxAssetID: 'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
    baseTxFee: 1000000n,
    createAssetTxFee: 10000000n,
    networkID: 1,
    hrp: 'avax',
    platformFeeConfig: {
        weights: Common.createDimensions({
            bandwidth: 1,
            dbRead: 1,
            dbWrite: 1,
            compute: 1,
        }),
        maxCapacity: 1_000_000n,
        maxPerSecond: 1_000n,
        targetPerSecond: 500n,
        minPrice: 1n,
        excessConversionConstant: 5_000n,
    },
};

export const testAvaxAssetID = Id.fromString(testContext.avaxAssetID);

export const testUTXOID = Id.fromHex(
    '0x5199944d5f58272adff87558c5c0857d3de3be01da518431523bff2bbf1117e6',
);

export const getValidUtxo = (
    amt = 50,
    assetId = testAvaxAssetID,
    owners = [pAddressForTest],
    locktime = 0,
    threshold = 1,
) => {
    const bigIntAmount = new BigIntPr(BigInt(amt * 1e9))
    const ownerBytes = owners.map(owner => Address.fromString(owner).toBytes())
    return new Utxo(
        new avaxSerial.UTXOID(testUTXOID, new Int(0)),
        assetId,
        new TransferOutput(
            bigIntAmount,
            OutputOwners.fromNative(ownerBytes, BigInt(locktime), threshold),
        ),
    );
};

export const feeState = (): pvm.FeeState => ({
    capacity: 999_999n,
    excess: 1n,
    price: 1n,
    timestamp: new Date().toISOString(),
});

export const createSubnetTx = (subnetOwners: {addresses: string[], threshold: number}) => ({
    unsignedTx: {
        _type: 'pvm.CreateSubnetTx',
        getSubnetOwners: () => ({
            addrs: subnetOwners.addresses.map(Address.fromString),
            threshold: new Int(subnetOwners.threshold)
        })
    }
} as unknown as avaxSerial.SignedTx)
