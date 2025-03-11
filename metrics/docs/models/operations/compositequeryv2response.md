# CompositeQueryV2Response

## Example Usage

```typescript
import { CompositeQueryV2Response } from "@avalanche-sdk/metrics/models/operations";

let value: CompositeQueryV2Response = {
  result: {
    subQueryCounts: {
      "1": 1,
      "2": 2,
      "3": 2,
    },
    totalCount: 2,
    addresses: [
      "0x1234567890abcdef1234567890abcdef123456789",
    ],
  },
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `result`                                                                               | [components.CompositeQueryResponse](../../models/components/compositequeryresponse.md) | :heavy_check_mark:                                                                     | N/A                                                                                    |