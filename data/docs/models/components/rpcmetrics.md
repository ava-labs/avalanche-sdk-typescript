# RpcMetrics

## Example Usage

```typescript
import { RpcMetrics } from "@avalanche-sdk/data/models/components";

let value: RpcMetrics = {
  timestamp: 2940.76,
  values: [
    {
      totalRequests: 4530.94,
      apiCreditsUsed: 4939.58,
      requestsPerSecond: 7781.72,
      successRatePercent: 8442.35,
      medianResponseTimeMsecs: 1390.72,
      invalidRequests: 4269.04,
      apiCreditsWasted: 8428.55,
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