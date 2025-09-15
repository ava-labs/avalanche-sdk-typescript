# GetICMRollingWindowMetricsByChainRequest

## Example Usage

```typescript
import { GetICMRollingWindowMetricsByChainRequest } from "@avalanche-sdk/chainkit/models/operations";

let value: GetICMRollingWindowMetricsByChainRequest = {
  metric: "ICMSrcRollingWindowMsgCount",
  network: "mainnet",
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            | Example                                                                                |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `metric`                                                                               | [components.ICMRollingWindowMetric](../../models/components/icmrollingwindowmetric.md) | :heavy_check_mark:                                                                     | Which chain level ICM metric to fetch for the rolling window.                          | ICMSrcRollingWindowMsgCount                                                            |
| `srcBlockchainId`                                                                      | *string*                                                                               | :heavy_minus_sign:                                                                     | Query param for retrieving items for a specific source (initiating) blockchain id.     |                                                                                        |
| `destBlockchainId`                                                                     | *string*                                                                               | :heavy_minus_sign:                                                                     | Query param for retrieving items for a specific destination (receiving) blockchain id. |                                                                                        |
| `network`                                                                              | [components.Network](../../models/components/network.md)                               | :heavy_minus_sign:                                                                     | Either mainnet or testnet/fuji.                                                        | mainnet                                                                                |