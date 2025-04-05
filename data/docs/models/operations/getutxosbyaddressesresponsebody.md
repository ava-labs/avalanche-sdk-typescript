# GetUtxosByAddressesResponseBody

Successful response


## Supported Types

### `components.ListPChainUtxosResponse`

```typescript
const value: components.ListPChainUtxosResponse = {
  utxos: [
    {
      addresses: [
        "avax1qm2a25eytsrj235hxg6jc0mwk99tss64eqevsw",
      ],
      asset: {
        assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
        name: "Avalanche",
        symbol: "AVAX",
        denomination: 9,
        type: "secp256k1",
        amount: "5001000",
      },
      consumedOnChainId: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      consumingTxHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
      createdOnChainId: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      utxoId: "68vLva9kfKUsX88ZPM8jdbf8qHUZRoZSFH6NdpAVTspkfrXDC",
      amount: "634.58",
      assetId: "<id>",
      blockNumber: "<value>",
      blockTimestamp: 8796.32,
      outputIndex: 1434.06,
      txHash: "<value>",
      utxoType: "TRANSFER",
    },
  ],
  chainInfo: {
    chainName: "c-chain",
    network: "mainnet",
  },
};
```

### `components.ListUtxosResponse`

```typescript
const value: components.ListUtxosResponse = {
  utxos: [
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
  chainInfo: {
    chainName: "x-chain",
    network: "mainnet",
  },
};
```

