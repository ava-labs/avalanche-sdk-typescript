# GetStakingMetricsResponse

## Example Usage

```typescript
import { GetStakingMetricsResponse } from "@avalanche-sdk/metrics/models/operations";

let value: GetStakingMetricsResponse = {
  result: {
    results: [
      {
        value: 602.25,
        timestamp: 6667.67,
      },
    ],
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `result`                                                                       | [components.MetricsApiResponse](../../models/components/metricsapiresponse.md) | :heavy_check_mark:                                                             | N/A                                                                            |