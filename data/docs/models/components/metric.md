# Metric

## Example Usage

```typescript
import { Metric } from "@avalanche-sdk/data/models/components";

let value: Metric = {
  timestamp: 5349.17,
  values: [
    {
      groupedBy: "chainId",
      totalRequests: 5241.84,
      requestsPerSecond: 3651,
      successRatePercent: 1905.67,
      medianResponseTimeMsecs: 191.22,
      invalidRequests: 5181.5,
      apiCreditsUsed: 8427.77,
      apiCreditsWasted: 3732.16,
    },
  ],
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `timestamp`                                                                          | *number*                                                                             | :heavy_check_mark:                                                                   | The timestamp of the metrics value                                                   |
| `values`                                                                             | [components.UsageMetricsValueDTO](../../models/components/usagemetricsvaluedto.md)[] | :heavy_check_mark:                                                                   | The metrics values for the timestamp                                                 |