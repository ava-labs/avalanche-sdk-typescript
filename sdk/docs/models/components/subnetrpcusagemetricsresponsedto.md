# SubnetRpcUsageMetricsResponseDTO

## Example Usage

```typescript
import { SubnetRpcUsageMetricsResponseDTO } from "@avalanche-sdk/sdk/models/components";

let value: SubnetRpcUsageMetricsResponseDTO = {
  aggregateDuration: "<value>",
  metrics: [
    {
      timestamp: 5386.09,
      values: [
        {
          totalRequests: 9703.82,
          apiCreditsUsed: 5020.47,
          requestsPerSecond: 3314.38,
          successRatePercent: 1605.69,
          medianResponseTimeMsecs: 666.46,
          invalidRequests: 8157.7,
          apiCreditsWasted: 5283.35,
          groupedBy: "responseCode",
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