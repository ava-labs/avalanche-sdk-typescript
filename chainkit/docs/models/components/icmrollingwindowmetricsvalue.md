# ICMRollingWindowMetricsValue

## Example Usage

```typescript
import { ICMRollingWindowMetricsValue } from "@avalanche-sdk/chainkit/models/components";

let value: ICMRollingWindowMetricsValue = {
  srcBlockchainId: "<id>",
  destBlockchainId: "<id>",
};
```

## Fields

| Field                                                     | Type                                                      | Required                                                  | Description                                               |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `lastHour`                                                | *number*                                                  | :heavy_minus_sign:                                        | Aggregated value for the current metrics in last hour.    |
| `lastDay`                                                 | *number*                                                  | :heavy_minus_sign:                                        | Aggregated value for the current metrics in last day.     |
| `lastWeek`                                                | *number*                                                  | :heavy_minus_sign:                                        | Aggregated value for the current metrics in last week.    |
| `lastMonth`                                               | *number*                                                  | :heavy_minus_sign:                                        | Aggregated value for the current metrics in last month.   |
| `last90Days`                                              | *number*                                                  | :heavy_minus_sign:                                        | Aggregated value for the current metrics in last 90 days. |
| `lastYear`                                                | *number*                                                  | :heavy_minus_sign:                                        | Aggregated value for the current metrics in last year.    |
| `allTime`                                                 | *number*                                                  | :heavy_minus_sign:                                        | Aggregated value for the current metrics for all time.    |
| `srcBlockchainId`                                         | *string*                                                  | :heavy_check_mark:                                        | Source blockchainId.                                      |
| `destBlockchainId`                                        | *string*                                                  | :heavy_check_mark:                                        | Destination blockchainId.                                 |