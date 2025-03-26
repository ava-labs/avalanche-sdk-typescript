# SubnetRpcUsageMetricsResponseDTO

## Example Usage

```typescript
import { SubnetRpcUsageMetricsResponseDTO } from "@avalanche-sdk/sdk/data/models/components";

let value: SubnetRpcUsageMetricsResponseDTO = {
  aggregateDuration: "<value>",
  metrics: [
    {
      timestamp: 4876.76,
      values: [
        {
          totalRequests: 5.45,
          apiCreditsUsed: 4254.02,
          requestsPerSecond: 635.53,
          successRatePercent: 2082.53,
          medianResponseTimeMsecs: 9323.94,
          invalidRequests: 2153.98,
          apiCreditsWasted: 8583.38,
          groupedBy: "userAgent",
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