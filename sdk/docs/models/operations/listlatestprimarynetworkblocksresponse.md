# ListLatestPrimaryNetworkBlocksResponse

## Example Usage

```typescript
import { ListLatestPrimaryNetworkBlocksResponse } from "@avalanche-sdk/sdk/models/operations";

let value: ListLatestPrimaryNetworkBlocksResponse = {
  result: {
    blocks: [
      {
        blockNumber: "<value>",
        blockHash: "<value>",
        parentHash: "<value>",
        blockTimestamp: 5630.13,
        blockType: "<value>",
        txCount: 7319.16,
        transactions: [
          "<value 1>",
          "<value 2>",
        ],
        blockSizeBytes: 4652.32,
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

| Field                                                                                                      | Type                                                                                                       | Required                                                                                                   | Description                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `result`                                                                                                   | [components.ListPrimaryNetworkBlocksResponse](../../models/components/listprimarynetworkblocksresponse.md) | :heavy_check_mark:                                                                                         | N/A                                                                                                        |