# ListXChainVerticesResponse

## Example Usage

```typescript
import { ListXChainVerticesResponse } from "@avalanche-sdk/sdk/models/components";

let value: ListXChainVerticesResponse = {
  vertices: [
    {
      vertexHash: "<value>",
      parentHashes: [
        "<value>",
      ],
      vertexHeight: 9242.87,
      vertexIndex: 6366.59,
      vertexTimestamp: 7539.02,
      txCount: 1786.08,
      transactions: [
        "<value>",
      ],
      vertexSizeBytes: 3626.95,
    },
  ],
  chainInfo: {
    chainName: "c-chain",
    network: "mainnet",
  },
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `vertices`                                                                                                                             | [components.XChainVertex](../../models/components/xchainvertex.md)[]                                                                   | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |
| `chainInfo`                                                                                                                            | [components.PrimaryNetworkChainInfo](../../models/components/primarynetworkchaininfo.md)                                               | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |