# GetEvmChainMetricsResponse

## Example Usage

```typescript
import { GetEvmChainMetricsResponse } from "@avalanche-sdk/devtools/models/operations";

let value: GetEvmChainMetricsResponse = {
  result: {
    results: [
      {
        value: 5840.6,
        timestamp: 9554.76,
      },
    ],
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `result`                                                                       | [components.MetricsApiResponse](../../models/components/metricsapiresponse.md) | :heavy_check_mark:                                                             | N/A                                                                            |