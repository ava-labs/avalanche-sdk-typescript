# UsageMetricsResponseDTO

## Example Usage

```typescript
import { UsageMetricsResponseDTO } from "@avalanche-sdk/sdk/models/components";

let value: UsageMetricsResponseDTO = {
  aggregateDuration: "<value>",
  orgId: "<id>",
  metrics: [
    {
      timestamp: 8551.32,
      values: [
        {
          groupedBy: "chainId",
          totalRequests: 8920.43,
          requestsPerSecond: 8703.67,
          successRatePercent: 8311.07,
          medianResponseTimeMsecs: 1144.51,
          invalidRequests: 4238.17,
          apiCreditsUsed: 1690.43,
          apiCreditsWasted: 4387.18,
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