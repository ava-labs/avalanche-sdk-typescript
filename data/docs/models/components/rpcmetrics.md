# RpcMetrics

## Example Usage

```typescript
import { RpcMetrics } from "@avalanche-sdk/data/models/components";

let value: RpcMetrics = {
  timestamp: 8180.34,
  values: [
    {
      totalRequests: 1024.13,
      apiCreditsUsed: 1563.83,
      requestsPerSecond: 3041.98,
      successRatePercent: 753.59,
      medianResponseTimeMsecs: 4246.63,
      invalidRequests: 1076.17,
      apiCreditsWasted: 5682.18,
      groupedBy: "responseCode",
    },
  ],
};
```

## Fields

| Field                                                                                                    | Type                                                                                                     | Required                                                                                                 | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `timestamp`                                                                                              | *number*                                                                                                 | :heavy_check_mark:                                                                                       | The timestamp of the metrics value                                                                       |
| `values`                                                                                                 | [components.RpcUsageMetricsValueAggregated](../../models/components/rpcusagemetricsvalueaggregated.md)[] | :heavy_check_mark:                                                                                       | The metrics values for the timestamp                                                                     |