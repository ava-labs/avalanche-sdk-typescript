# UsageMetricsValueDTO

## Example Usage

```typescript
import { UsageMetricsValueDTO } from "@avalanche-sdk/data/models/components";

let value: UsageMetricsValueDTO = {
  groupedBy: "requestPath",
  totalRequests: 2213.96,
  requestsPerSecond: 1000.14,
  successRatePercent: 2650.39,
  medianResponseTimeMsecs: 661.49,
  invalidRequests: 656.04,
  apiCreditsUsed: 8562.77,
  apiCreditsWasted: 1621.2,
};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `groupedBy`                                                                                          | [components.UsageMetricsValueDTOGroupedBy](../../models/components/usagemetricsvaluedtogroupedby.md) | :heavy_check_mark:                                                                                   | Column name used for data aggregation                                                                |
| `groupValue`                                                                                         | *components.UsageMetricsValueDTOGroupValue*                                                          | :heavy_minus_sign:                                                                                   | The value of the column used for data aggregation                                                    |
| `totalRequests`                                                                                      | *number*                                                                                             | :heavy_check_mark:                                                                                   | The total number of requests                                                                         |
| `requestsPerSecond`                                                                                  | *number*                                                                                             | :heavy_check_mark:                                                                                   | The number of requests per second                                                                    |
| `successRatePercent`                                                                                 | *number*                                                                                             | :heavy_check_mark:                                                                                   | The success rate percentage                                                                          |
| `medianResponseTimeMsecs`                                                                            | *number*                                                                                             | :heavy_check_mark:                                                                                   | The median response time in milliseconds                                                             |
| `invalidRequests`                                                                                    | *number*                                                                                             | :heavy_check_mark:                                                                                   | The number of invalid requests                                                                       |
| `apiCreditsUsed`                                                                                     | *number*                                                                                             | :heavy_check_mark:                                                                                   | The number of API credits used                                                                       |
| `apiCreditsWasted`                                                                                   | *number*                                                                                             | :heavy_check_mark:                                                                                   | The number of API credits wasted on invalid requests                                                 |