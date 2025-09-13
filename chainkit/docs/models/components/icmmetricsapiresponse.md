# ICMMetricsApiResponse

## Example Usage

```typescript
import { ICMMetricsApiResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ICMMetricsApiResponse = {
  results: [
    {
      value: 3102.36,
      timestamp: 6928.09,
      srcBlockchainId: "<id>",
      destBlockchainId: "<id>",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `results`                                                                                                                              | [components.ICMMetricsValue](../../models/components/icmmetricsvalue.md)[]                                                             | :heavy_check_mark:                                                                                                                     | Array of current ICM metrics values.                                                                                                   |