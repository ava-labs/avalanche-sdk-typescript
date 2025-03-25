# RpcUsageMetricsValueAggregated

## Example Usage

```typescript
import { RpcUsageMetricsValueAggregated } from "@avalanche-sdk/data/models/components";

let value: RpcUsageMetricsValueAggregated = {
  totalRequests: 4181.09,
  apiCreditsUsed: 1729.51,
  requestsPerSecond: 1072.1,
  successRatePercent: 8173.39,
  medianResponseTimeMsecs: 4731.43,
  invalidRequests: 8822.84,
  apiCreditsWasted: 7332.89,
  groupedBy: "requestPath",
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