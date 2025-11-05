# GetUtxosByAddressesV2Response

## Example Usage

```typescript
import { GetUtxosByAddressesV2Response } from "@avalanche-sdk/chainkit/models/operations";

let value: GetUtxosByAddressesV2Response = {
  result: {
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
        amount: "871.14",
        assetId: "<id>",
        blockNumber: "<value>",
        blockTimestamp: 9647.88,
        outputIndex: 5158.07,
        txHash: "<value>",
        utxoType: "STAKE",
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

| Field                                          | Type                                           | Required                                       | Description                                    |
| ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `result`                                       | *operations.GetUtxosByAddressesV2ResponseBody* | :heavy_check_mark:                             | N/A                                            |