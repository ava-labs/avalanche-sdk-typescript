# ListPrimaryNetworkBlocksByNodeIdResponse

## Example Usage

```typescript
import { ListPrimaryNetworkBlocksByNodeIdResponse } from "@avalanche-sdk/sdk/models/operations";

let value: ListPrimaryNetworkBlocksByNodeIdResponse = {
  result: {
    blocks: [
      {
        blockNumber: "<value>",
        blockHash: "<value>",
        parentHash: "<value>",
        blockTimestamp: 6484.2,
        blockType: "<value>",
        txCount: 5630.13,
        transactions: [
          "<value>",
        ],
        blockSizeBytes: 7319.16,
      },
    ],
    chainInfo: {
      chainName: "x-chain",
      network: "mainnet",
    },
  },
};
```

## Fields

| Field                                                                                                      | Type                                                                                                       | Required                                                                                                   | Description                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `result`                                                                                                   | [components.ListPrimaryNetworkBlocksResponse](../../models/components/listprimarynetworkblocksresponse.md) | :heavy_check_mark:                                                                                         | N/A                                                                                                        |