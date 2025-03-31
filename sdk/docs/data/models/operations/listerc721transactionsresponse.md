# ListErc721TransactionsResponse

## Example Usage

```typescript
import { ListErc721TransactionsResponse } from "@avalanche-sdk/sdk/data/models/operations";

let value: ListErc721TransactionsResponse = {
  result: {
    transactions: [
      {
        blockNumber: "339",
        blockTimestamp: 1648672486,
        blockHash:
          "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
        txHash:
          "0x3e9303f81be00b4af28515dab7b914bf3dbff209ea10e7071fa24d4af0a112d4",
        from: {
          name: "Wrapped AVAX",
          symbol: "WAVAX",
          decimals: 18,
          logoUri:
            "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
          address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        },
        to: {
          name: "Wrapped AVAX",
          symbol: "WAVAX",
          decimals: 18,
          logoUri:
            "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
          address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        },
        logIndex: 7791.8,
        erc721Token: {
          address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          name: "Wrapped AVAX",
          symbol: "WAVAX",
          ercType: "ERC-721",
          tokenId: "<id>",
          tokenUri: "https://grown-rust.net",
          metadata: {
            indexStatus: "MISSING_TOKEN",
          },
          ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        },
      },
    ],
  },
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `result`                                                                                               | [components.ListErc721TransactionsResponse](../../models/components/listerc721transactionsresponse.md) | :heavy_check_mark:                                                                                     | N/A                                                                                                    |