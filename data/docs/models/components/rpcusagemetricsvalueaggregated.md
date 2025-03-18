# RpcUsageMetricsValueAggregated

## Example Usage

```typescript
import { RpcUsageMetricsValueAggregated } from "@avalanche-sdk/data/models/components";

let value: RpcUsageMetricsValueAggregated = {
  totalRequests: 3041.98,
  apiCreditsUsed: 753.59,
  requestsPerSecond: 4246.63,
  successRatePercent: 1076.17,
  medianResponseTimeMsecs: 5682.18,
  invalidRequests: 2465.57,
  apiCreditsWasted: 5964.33,
  groupedBy: "rpcMethod",
};
```

## Fields

| Field                                                                                                                    | Type                                                                                                                     | Required                                                                                                                 | Description                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `totalRequests`                                                                                                          | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | The total number of requests                                                                                             |
| `apiCreditsUsed`                                                                                                         | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | The number of API credits used                                                                                           |
| `requestsPerSecond`                                                                                                      | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | The number of requests per second                                                                                        |
| `successRatePercent`                                                                                                     | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | The success rate percentage                                                                                              |
| `medianResponseTimeMsecs`                                                                                                | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | The median response time in milliseconds                                                                                 |
| `invalidRequests`                                                                                                        | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | The number of invalid requests                                                                                           |
| `apiCreditsWasted`                                                                                                       | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | The number of API credits wasted on invalid requests                                                                     |
| `groupedBy`                                                                                                              | [components.RpcUsageMetricsValueAggregatedGroupedBy](../../models/components/rpcusagemetricsvalueaggregatedgroupedby.md) | :heavy_check_mark:                                                                                                       | Column name used for data aggregation                                                                                    |
| `groupValue`                                                                                                             | *components.RpcUsageMetricsValueAggregatedGroupValue*                                                                    | :heavy_minus_sign:                                                                                                       | The value of the column used for data aggregation                                                                        |