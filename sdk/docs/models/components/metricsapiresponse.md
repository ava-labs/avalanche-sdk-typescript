# MetricsApiResponse

## Example Usage

```typescript
import { MetricsApiResponse } from "@avalanche-sdk/sdk/models/components";

let value: MetricsApiResponse = {
  results: [
    {
      value: 6057.76,
      timestamp: 6951.97,
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `results`                                                                                                                              | [components.MetricsValue](../../models/components/metricsvalue.md)[]                                                                   | :heavy_check_mark:                                                                                                                     | Array of current metrics values at different timestamps.                                                                               |