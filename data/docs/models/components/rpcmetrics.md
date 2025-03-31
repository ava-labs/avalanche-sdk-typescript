# RpcMetrics

## Example Usage

```typescript
import { RpcMetrics } from "@avalanche-sdk/data/models/components";

let value: RpcMetrics = {
  timestamp: 9149.71,
  values: [
    {
      totalRequests: 7317.44,
      apiCreditsUsed: 7275.47,
      requestsPerSecond: 2899.13,
      successRatePercent: 5777.1,
      medianResponseTimeMsecs: 7791.8,
      invalidRequests: 7955.91,
      apiCreditsWasted: 3445.3,
      groupedBy: "userAgent",
    },
  ],
};
```

## Fields

| Field                                                                                                    | Type                                                                                                     | Required                                                                                                 | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `timestamp`                                                                                              | *number*                                                                                                 | :heavy_check_mark:                                                                                       | The timestamp of the metrics value                                                                       |
| `values`                                                                                                 | [components.RpcUsageMetricsValueAggregated](../../models/components/rpcusagemetricsvalueaggregated.md)[] | :heavy_check_mark:                                                                                       | The metrics values for the timestamp                                                                     |