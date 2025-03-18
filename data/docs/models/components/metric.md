# Metric

## Example Usage

```typescript
import { Metric } from "@avalanche-sdk/data/models/components";

let value: Metric = {
  timestamp: 1097.84,
  values: [
    {
      groupedBy: "apiKeyId",
      totalRequests: 7032.18,
      requestsPerSecond: 6347.86,
      successRatePercent: 9591.43,
      medianResponseTimeMsecs: 1032.98,
      invalidRequests: 8671.68,
      apiCreditsUsed: 291.9,
      apiCreditsWasted: 5349.17,
    },
  ],
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `timestamp`                                                                          | *number*                                                                             | :heavy_check_mark:                                                                   | The timestamp of the metrics value                                                   |
| `values`                                                                             | [components.UsageMetricsValueDTO](../../models/components/usagemetricsvaluedto.md)[] | :heavy_check_mark:                                                                   | The metrics values for the timestamp                                                 |