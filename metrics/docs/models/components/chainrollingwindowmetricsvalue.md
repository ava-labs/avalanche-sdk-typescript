# ChainRollingWindowMetricsValue

## Example Usage

```typescript
import { ChainRollingWindowMetricsValue } from "@avalanche-sdk/metrics/models/components";

let value: ChainRollingWindowMetricsValue = {
  lastHour: 9866.7,
  lastDay: 6987.1,
  lastMonth: 2680.88,
  lastYear: 8149.01,
  allTime: 6874.99,
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