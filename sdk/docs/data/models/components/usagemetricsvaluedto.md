# UsageMetricsValueDTO

## Example Usage

```typescript
import { UsageMetricsValueDTO } from "@avalanche-sdk/sdk/data/models/components";

let value: UsageMetricsValueDTO = {
  groupedBy: "apiKeyId",
  totalRequests: 3004.03,
  requestsPerSecond: 5495.01,
  successRatePercent: 9308.19,
  medianResponseTimeMsecs: 5207.61,
  invalidRequests: 2672.07,
  apiCreditsUsed: 8773.99,
  apiCreditsWasted: 3719.19,
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