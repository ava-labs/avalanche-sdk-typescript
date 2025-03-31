# ListLatestXChainVerticesResponse

## Example Usage

```typescript
import { ListLatestXChainVerticesResponse } from "@avalanche-sdk/sdk/data/models/operations";

let value: ListLatestXChainVerticesResponse = {
  result: {
    vertices: [
      {
        vertexHash: "<value>",
        parentHashes: [
          "<value>",
        ],
        vertexHeight: 6150.58,
        vertexIndex: 5524.39,
        vertexTimestamp: 2959.5,
        txCount: 9292.92,
        transactions: [
          "<value>",
        ],
        vertexSizeBytes: 2659.05,
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

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `result`                                                                                       | [components.ListXChainVerticesResponse](../../models/components/listxchainverticesresponse.md) | :heavy_check_mark:                                                                             | N/A                                                                                            |