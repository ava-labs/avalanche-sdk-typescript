# RpcMetrics

## Example Usage

```typescript
import { RpcMetrics } from "@avalanche-sdk/sdk/data/models/components";

let value: RpcMetrics = {
  timestamp: 1591.46,
  values: [
    {
      totalRequests: 6057.12,
      apiCreditsUsed: 1156.61,
      requestsPerSecond: 7278.88,
      successRatePercent: 6374.62,
      medianResponseTimeMsecs: 8119.39,
      invalidRequests: 4793.85,
      apiCreditsWasted: 9148.64,
      groupedBy: "rpcMethod",
    },
  ],
};
```

## Fields

| Field                                                                                                    | Type                                                                                                     | Required                                                                                                 | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `timestamp`                                                                                              | *number*                                                                                                 | :heavy_check_mark:                                                                                       | The timestamp of the metrics value                                                                       |
| `values`                                                                                                 | [components.RpcUsageMetricsValueAggregated](../../models/components/rpcusagemetricsvalueaggregated.md)[] | :heavy_check_mark:                                                                                       | The metrics values for the timestamp                                                                     |