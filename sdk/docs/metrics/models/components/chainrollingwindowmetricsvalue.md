# ChainRollingWindowMetricsValue

## Example Usage

```typescript
import { ChainRollingWindowMetricsValue } from "@avalanche-sdk/sdk/metrics/models/components";

let value: ChainRollingWindowMetricsValue = {
  lastHour: 202.18,
  lastDay: 8326.2,
  lastMonth: 7781.57,
  lastYear: 8700.13,
  allTime: 9786.19,
};
```

## Fields

| Field                                                   | Type                                                    | Required                                                | Description                                             |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `lastHour`                                              | *number*                                                | :heavy_check_mark:                                      | Aggregated value for the current metrics in last hour.  |
| `lastDay`                                               | *number*                                                | :heavy_check_mark:                                      | Aggregated value for the current metrics in last day.   |
| `lastMonth`                                             | *number*                                                | :heavy_check_mark:                                      | Aggregated value for the current metrics in last month. |
| `lastYear`                                              | *number*                                                | :heavy_check_mark:                                      | Aggregated value for the current metrics in last year.  |
| `allTime`                                               | *number*                                                | :heavy_check_mark:                                      | Aggregated value for the current metrics for all time.  |