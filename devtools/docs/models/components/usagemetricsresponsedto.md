# UsageMetricsResponseDTO

## Example Usage

```typescript
import { UsageMetricsResponseDTO } from "@avalanche-sdk/devtools/models/components";

let value: UsageMetricsResponseDTO = {
  aggregateDuration: "<value>",
  orgId: "<id>",
  metrics: [
    {
      timestamp: 3713.32,
      values: [
        {
          groupedBy: "None",
          totalRequests: 8311.07,
          requestsPerSecond: 1144.51,
          successRatePercent: 4238.17,
          medianResponseTimeMsecs: 1690.43,
          invalidRequests: 4387.18,
          apiCreditsUsed: 5704.86,
          apiCreditsWasted: 7901.21,
        },
      ],
    },
  ],
};
```

## Fields

| Field                                                    | Type                                                     | Required                                                 | Description                                              |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `aggregateDuration`                                      | *string*                                                 | :heavy_check_mark:                                       | Duration in which the metrics value is aggregated        |
| `orgId`                                                  | *string*                                                 | :heavy_check_mark:                                       | Org ID for which the metrics are aggregated              |
| `metrics`                                                | [components.Metric](../../models/components/metric.md)[] | :heavy_check_mark:                                       | Metrics values                                           |