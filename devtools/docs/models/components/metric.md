# Metric

## Example Usage

```typescript
import { Metric } from "@avalanche-sdk/devtools/models/components";

let value: Metric = {
  timestamp: 8029.57,
  values: [
    {
      groupedBy: "requestPath",
      totalRequests: 6527.92,
      requestsPerSecond: 8149.71,
      successRatePercent: 1220.89,
      medianResponseTimeMsecs: 4613.47,
      invalidRequests: 5776.31,
      apiCreditsUsed: 2736.37,
      apiCreditsWasted: 4469.46,
    },
  ],
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `timestamp`                                                                          | *number*                                                                             | :heavy_check_mark:                                                                   | The timestamp of the metrics value                                                   |
| `values`                                                                             | [components.UsageMetricsValueDTO](../../models/components/usagemetricsvaluedto.md)[] | :heavy_check_mark:                                                                   | The metrics values for the timestamp                                                 |