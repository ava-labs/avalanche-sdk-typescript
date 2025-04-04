# RpcMetrics

## Example Usage

```typescript
import { RpcMetrics } from "@avalanche-sdk/devtools/models/components";

let value: RpcMetrics = {
  timestamp: 1158.29,
  values: [
    {
      totalRequests: 2016.58,
      apiCreditsUsed: 6183.71,
      requestsPerSecond: 8704.65,
      successRatePercent: 8469.62,
      medianResponseTimeMsecs: 4253.06,
      invalidRequests: 4201.69,
      apiCreditsWasted: 2765.48,
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