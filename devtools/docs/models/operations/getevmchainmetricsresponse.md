# GetEvmChainMetricsResponse

## Example Usage

```typescript
import { GetEvmChainMetricsResponse } from "@avalanche-sdk/devtools/models/operations";

let value: GetEvmChainMetricsResponse = {
  result: {
    results: [
      {
        value: 6951.97,
        timestamp: 4829.81,
      },
    ],
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `result`                                                                       | [components.MetricsApiResponse](../../models/components/metricsapiresponse.md) | :heavy_check_mark:                                                             | N/A                                                                            |