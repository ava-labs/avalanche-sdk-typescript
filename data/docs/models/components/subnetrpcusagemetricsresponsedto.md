# SubnetRpcUsageMetricsResponseDTO

## Example Usage

```typescript
import { SubnetRpcUsageMetricsResponseDTO } from "@avalanche-sdk/data/models/components";

let value: SubnetRpcUsageMetricsResponseDTO = {
  aggregateDuration: "<value>",
  metrics: [
    {
      timestamp: 9918.91,
      values: [
        {
          totalRequests: 3767.41,
          apiCreditsUsed: 9661.48,
          requestsPerSecond: 7918.8,
          successRatePercent: 6756.89,
          medianResponseTimeMsecs: 2448.89,
          invalidRequests: 2164.57,
          apiCreditsWasted: 1660.47,
          groupedBy: "None",
        },
      ],
    },
  ],
  chainId: "<id>",
};
```

## Fields

| Field                                                            | Type                                                             | Required                                                         | Description                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `aggregateDuration`                                              | *string*                                                         | :heavy_check_mark:                                               | Duration in which the metrics value is aggregated                |
| `metrics`                                                        | [components.RpcMetrics](../../models/components/rpcmetrics.md)[] | :heavy_check_mark:                                               | Metrics values                                                   |
| `chainId`                                                        | *string*                                                         | :heavy_check_mark:                                               | ChainId for which the metrics are aggregated                     |