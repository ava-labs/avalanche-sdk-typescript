# ListLatestPrimaryNetworkTransactionsResponse

## Example Usage

```typescript
import { ListLatestPrimaryNetworkTransactionsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListLatestPrimaryNetworkTransactionsResponse = {
  result: {
    transactions: [
      {
        txHash: "3P91K6nuDFvDodcRuJTsgdf9SvYe5pMiKk38HppsoeAiEztCP",
        txType: "CreateChainTx",
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
              type: "secp256k1",
              amount: "5001000",
            },
            consumedOnChainId:
              "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
            consumingTxHash:
              "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
            createdOnChainId:
              "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
            utxoId: "68vLva9kfKUsX88ZPM8jdbf8qHUZRoZSFH6NdpAVTspkfrXDC",
            amount: "480.06",
            assetId: "<id>",
            blockNumber: "<value>",
            blockTimestamp: 5221.76,
            outputIndex: 8536.06,
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
            consumingTxHash:
              "3j9JpF1aGuQtLLbo3YkvvKkWrCZViXZjdeJQWUSEY5hcqUn2c",
            createdOnChainId:
              "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
            utxoId: "68vLva9kfKUsX88ZPM8jdbf8qHUZRoZSFH6NdpAVTspkfrXDC",
            amount: "622.90",
            assetId: "<id>",
            blockNumber: "<value>",
            blockTimestamp: 1114.96,
            outputIndex: 4589.7,
            txHash: "<value>",
            utxoType: "STAKE",
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
            type: "secp256k1",
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
      chainName: "c-chain",
      network: "mainnet",
    },
  },
};
```

## Fields

| Field                                                         | Type                                                          | Required                                                      | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `result`                                                      | *operations.ListLatestPrimaryNetworkTransactionsResponseBody* | :heavy_check_mark:                                            | N/A                                                           |