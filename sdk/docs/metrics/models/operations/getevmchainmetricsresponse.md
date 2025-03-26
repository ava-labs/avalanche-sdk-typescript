# GetEvmChainMetricsResponse

## Example Usage

```typescript
import { GetEvmChainMetricsResponse } from "@avalanche-sdk/sdk/metrics/models/operations";

let value: GetEvmChainMetricsResponse = {
  result: {
    results: [
      {
        value: 4614.79,
        timestamp: 7805.29,
      },
    ],
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `result`                                                                       | [components.MetricsApiResponse](../../models/components/metricsapiresponse.md) | :heavy_check_mark:                                                             | N/A                                                                            |