# GetTeleporterMetricsByChainRequest

## Example Usage

```typescript
import { GetTeleporterMetricsByChainRequest } from "@avalanche-sdk/metrics/models/operations";

let value: GetTeleporterMetricsByChainRequest = {
  metric: "teleporterSourceTxnCount",
};
```

## Fields

| Field                                                                                                                                 | Type                                                                                                                                  | Required                                                                                                                              | Description                                                                                                                           | Example                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `metric`                                                                                                                              | [components.TeleporterMetric](../../models/components/teleportermetric.md)                                                            | :heavy_check_mark:                                                                                                                    | Which chain level teleporter metric to fetch.                                                                                         | teleporterSourceTxnCount                                                                                                              |
| `chainId`                                                                                                                             | *string*                                                                                                                              | :heavy_minus_sign:                                                                                                                    | A supported EVM chain ID or one of "total", "mainnet", or "testnet". Use the `/chains` endpoint to get a list of supported chain IDs. | 43114                                                                                                                                 |