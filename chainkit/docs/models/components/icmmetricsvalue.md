# ICMMetricsValue

## Example Usage

```typescript
import { ICMMetricsValue } from "@avalanche-sdk/chainkit/models/components";

let value: ICMMetricsValue = {
  value: 7310.5,
  timestamp: 9026.67,
  srcBlockchainId: "<id>",
  destBlockchainId: "<id>",
};
```

## Fields

| Field                                                                                                                                                                | Type                                                                                                                                                                 | Required                                                                                                                                                             | Description                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`                                                                                                                                                              | *number*                                                                                                                                                             | :heavy_check_mark:                                                                                                                                                   | Aggregated value for the current metrics.                                                                                                                            |
| `timestamp`                                                                                                                                                          | *number*                                                                                                                                                             | :heavy_check_mark:                                                                                                                                                   | Unix Epoch timestamp for which metrics are aggregated. Depending on the interval of the metric this can be at the start of the relevant hour, day, month, year, etc. |
| `srcBlockchainId`                                                                                                                                                    | *string*                                                                                                                                                             | :heavy_check_mark:                                                                                                                                                   | Source blockchainId.                                                                                                                                                 |
| `destBlockchainId`                                                                                                                                                   | *string*                                                                                                                                                             | :heavy_check_mark:                                                                                                                                                   | Destination blockchainId.                                                                                                                                            |