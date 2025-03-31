# CChainExportTransaction

## Example Usage

```typescript
import { CChainExportTransaction } from "@avalanche-sdk/data/models/components";

let value: CChainExportTransaction = {
  txHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
  blockHeight: 1005,
  blockHash:
    "0x57a5cb7704561d1d59bd563b6421021b7563960c05ba3ae0e36fc36917c742ee",
  timestamp: 1600762738,
  memo: "0x546865204176616c616e6368652050726f6a656374",
  amountUnlocked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "secp256k1",
      amount: "5001000",
    },
  ],
  amountCreated: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "nft",
      amount: "5001000",
    },
  ],
  sourceChain: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
  destinationChain: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
  txType: "ExportTx",
  evmInputs: [
    {
      fromAddress: "0xD0f2898e49d941D6d479B381d3C8F0bd8d983b4c",
      asset: {
        assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
        name: "Avalanche",
        symbol: "AVAX",
        denomination: 9,
        type: "secp256k1",
        amount: "5001000",
      },
      credentials: [
        {
          signature:
            "bWWoZUu0Z3STjuk/+2az7M4vP0oqc9NtiA7kOdqINCIE/2+5va5R1KNCWwEX5jE1xVHLvAxU2LHTN5gK8m84HwA",
          publicKey: "AdMQOtubgBFFJu++0faHPIIA6KmdZ2ERErMRGzyy6juI",
        },
      ],
    },
  ],
  emittedUtxos: [
    {
      addresses: [
        "avax1qm2a25eytsrj235hxg6jc0mwk99tss64eqevsw",
      ],
      asset: {
        assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
        name: "Avalanche",
        symbol: "AVAX",
        denomination: 9,
        type: "nft",
        amount: "5001000",
      },
      consumedOnChainId: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      consumingTxHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
      createdOnChainId: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      utxoId: "68vLva9kfKUsX88ZPM8jdbf8qHUZRoZSFH6NdpAVTspkfrXDC",
      consumingTxTimestamp: 1599696000,
      creationTxHash: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
      credentials: [
        {
          signature:
            "bWWoZUu0Z3STjuk/+2az7M4vP0oqc9NtiA7kOdqINCIE/2+5va5R1KNCWwEX5jE1xVHLvAxU2LHTN5gK8m84HwA",
          publicKey: "AdMQOtubgBFFJu++0faHPIIA6KmdZ2ERErMRGzyy6juI",
        },
      ],
      locktime: 0,
      outputIndex: "38",
      threshold: 1,
      timestamp: 1599696000,
      utxoType: "mint",
    },
  ],
};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          | Example                                                                                              |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `txHash`                                                                                             | *string*                                                                                             | :heavy_check_mark:                                                                                   | Unique ID for this transaction.                                                                      | 3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c                                                    |
| `blockHeight`                                                                                        | *number*                                                                                             | :heavy_check_mark:                                                                                   | Height of the block this transaction belongs to.                                                     | 1005                                                                                                 |
| `blockHash`                                                                                          | *string*                                                                                             | :heavy_check_mark:                                                                                   | Hash of the block this transaction belongs to.                                                       | 0x57a5cb7704561d1d59bd563b6421021b7563960c05ba3ae0e36fc36917c742ee                                   |
| `timestamp`                                                                                          | *number*                                                                                             | :heavy_check_mark:                                                                                   | Latest timestamp in seconds this transaction was accepted.                                           | 1600762738                                                                                           |
| `memo`                                                                                               | *string*                                                                                             | :heavy_check_mark:                                                                                   | Hex encoded memo bytes for this transaction.                                                         | 0x546865204176616c616e6368652050726f6a656374                                                         |
| `amountUnlocked`                                                                                     | [components.AssetAmount](../../models/components/assetamount.md)[]                                   | :heavy_check_mark:                                                                                   | Assets unlocked by inputs of this transaction.                                                       |                                                                                                      |
| `amountCreated`                                                                                      | [components.AssetAmount](../../models/components/assetamount.md)[]                                   | :heavy_check_mark:                                                                                   | Assets created by outputs of this transaction.                                                       |                                                                                                      |
| `sourceChain`                                                                                        | *string*                                                                                             | :heavy_check_mark:                                                                                   | Source chain for an atomic transaction.                                                              | 2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM                                                   |
| `destinationChain`                                                                                   | *string*                                                                                             | :heavy_check_mark:                                                                                   | Destination chain for an atomic transaction.                                                         | 2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM                                                   |
| `txType`                                                                                             | [components.CChainExportTransactionTxType](../../models/components/cchainexporttransactiontxtype.md) | :heavy_check_mark:                                                                                   | Type of transaction.                                                                                 | ExportTx                                                                                             |
| `evmInputs`                                                                                          | [components.EVMInput](../../models/components/evminput.md)[]                                         | :heavy_check_mark:                                                                                   | N/A                                                                                                  |                                                                                                      |
| `emittedUtxos`                                                                                       | [components.Utxo](../../models/components/utxo.md)[]                                                 | :heavy_check_mark:                                                                                   | N/A                                                                                                  |                                                                                                      |