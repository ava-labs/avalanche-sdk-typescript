# GetICMSummaryRequest

## Example Usage

```typescript
import { GetICMSummaryRequest } from "@avalanche-sdk/chainkit/models/operations";

let value: GetICMSummaryRequest = {
  groupBy: "destBlockchainId",
  network: "mainnet",
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            | Example                                                                                |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `srcBlockchainId`                                                                      | *string*                                                                               | :heavy_minus_sign:                                                                     | Query param for retrieving items for a specific source (initiating) blockchain id.     |                                                                                        |
| `destBlockchainId`                                                                     | *string*                                                                               | :heavy_minus_sign:                                                                     | Query param for retrieving items for a specific destination (receiving) blockchain id. |                                                                                        |
| `groupBy`                                                                              | [operations.GetICMSummaryGroupBy](../../models/operations/geticmsummarygroupby.md)     | :heavy_minus_sign:                                                                     | Group results by srcBlockchainId, destBlockchainId, or both (comma-separated)          | destBlockchainId                                                                       |
| `network`                                                                              | [components.Network](../../models/components/network.md)                               | :heavy_minus_sign:                                                                     | Either mainnet or testnet/fuji.                                                        | mainnet                                                                                |