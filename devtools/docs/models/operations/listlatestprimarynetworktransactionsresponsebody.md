# ListLatestPrimaryNetworkTransactionsResponseBody

Successful response


## Supported Types

### `components.ListPChainTransactionsResponse`

```typescript
const value: components.ListPChainTransactionsResponse = {
  transactions: [
    {
      txHash: "3P91K6nuDFvDodcRuJTsgdf9SvYe5pMiKk38HppsoeAiEztCP",
      txType: "AddPermissionlessValidatorTx",
      blockTimestamp: 1648672486,
      blockNumber: "<value>",
      blockHash: "<value>",
      consumedUtxos: [
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
          consumedOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          consumingTxHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
          createdOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          utxoId: "68vLva9kfKUsX88ZPM8jdbf8qHUZRoZSFH6NdpAVTspkfrXDC",
          amount: "469.46",
          assetId: "<id>",
          blockNumber: "<value>",
          blockTimestamp: 7817.74,
          outputIndex: 8202.32,
          txHash: "<value>",
          utxoType: "TRANSFER",
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
            type: "secp256k1",
            amount: "5001000",
          },
          consumedOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          consumingTxHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
          createdOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          utxoId: "68vLva9kfKUsX88ZPM8jdbf8qHUZRoZSFH6NdpAVTspkfrXDC",
          amount: "508.67",
          assetId: "<id>",
          blockNumber: "<value>",
          blockTimestamp: 4322.48,
          outputIndex: 7206.14,
          txHash: "<value>",
          utxoType: "TRANSFER",
        },
      ],
      sourceChain: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      destinationChain: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      value: [
        {
          assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
          type: "nft",
          amount: "5001000",
        },
      ],
      amountBurned: [
        {
          assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
          type: "secp256k1",
          amount: "5001000",
        },
      ],
      amountStaked: [
        {
          assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
          type: "nft",
          amount: "5001000",
        },
      ],
      amountL1ValidatorBalanceBurned: [
        {
          assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
          type: "secp256k1",
          amount: "5001000",
        },
      ],
      subnetOwnershipInfo: {
        locktime: 0,
        threshold: 1,
        addresses: [
          "avax1qm2a25eytsrj235hxg6jc0mwk99tss64eqevsw",
        ],
      },
    },
  ],
  chainInfo: {
    chainName: "p-chain",
    network: "mainnet",
  },
};
```

### `components.ListXChainTransactionsResponse`

```typescript
const value: components.ListXChainTransactionsResponse = {
  transactions: [
    {
      txHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
      chainFormat: "non-linear",
      timestamp: 1600762738,
      txType: "OperationTx",
      memo: "0x546865204176616c616e6368652050726f6a656374",
      consumedUtxos: [
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
          consumedOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          consumingTxHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
          createdOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
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
          consumedOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          consumingTxHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
          createdOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
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
      amountUnlocked: [
        {
          assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
          type: "nft",
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
      assetCreated: {
        assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
        name: "Avalanche",
        symbol: "AVAX",
        denomination: 9,
        type: "nft",
        createdAtTimestamp: 1675444720,
        cap: "variable",
      },
      vertices: [
        {
          hash: "82qPRREHmh8Cfta4PGD6GymY9ZLyvgYugqW6hj9FykpMVRz1S",
          height: 1961,
          timestamp: 1600762738,
        },
      ],
    },
  ],
  chainInfo: {
    chainName: "p-chain",
    network: "mainnet",
  },
};
```

### `components.ListCChainAtomicTransactionsResponse`

```typescript
const value: components.ListCChainAtomicTransactionsResponse = {
  transactions: [
    {
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
          type: "secp256k1",
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
            type: "nft",
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
            type: "secp256k1",
            amount: "5001000",
          },
          consumedOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          consumingTxHash: "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
          createdOnChainId:
            "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
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
    },
  ],
  chainInfo: {
    chainName: "x-chain",
    network: "mainnet",
  },
};
```

