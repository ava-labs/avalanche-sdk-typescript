# Metric

## Example Usage

```typescript
import { Metric } from "@avalanche-sdk/data/models/components";

let value: Metric = {
  timestamp: 3182.33,
  values: [
    {
      groupedBy: "None",
      totalRequests: 4585.03,
      requestsPerSecond: 4445.87,
      successRatePercent: 3361.02,
      medianResponseTimeMsecs: 8806.79,
      invalidRequests: 9450.27,
      apiCreditsUsed: 9918.91,
      apiCreditsWasted: 3767.41,
    },
  ],
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `timestamp`                                                                          | *number*                                                                             | :heavy_check_mark:                                                                   | The timestamp of the metrics value                                                   |
| `values`                                                                             | [components.UsageMetricsValueDTO](../../models/components/usagemetricsvaluedto.md)[] | :heavy_check_mark:                                                                   | The metrics values for the timestamp                                                 |