# Metric

## Example Usage

```typescript
import { Metric } from "@avalanche-sdk/sdk/data/models/components";

let value: Metric = {
  timestamp: 1173.8,
  values: [
    {
      groupedBy: "requestPath",
      totalRequests: 468.06,
      requestsPerSecond: 9707.32,
      successRatePercent: 38.6,
      medianResponseTimeMsecs: 1785.8,
      invalidRequests: 6128.67,
      apiCreditsUsed: 813.69,
      apiCreditsWasted: 8818.97,
    },
  ],
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `timestamp`                                                                          | *number*                                                                             | :heavy_check_mark:                                                                   | The timestamp of the metrics value                                                   |
| `values`                                                                             | [components.UsageMetricsValueDTO](../../models/components/usagemetricsvaluedto.md)[] | :heavy_check_mark:                                                                   | The metrics values for the timestamp                                                 |