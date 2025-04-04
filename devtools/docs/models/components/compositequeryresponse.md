# CompositeQueryResponse

## Example Usage

```typescript
import { CompositeQueryResponse } from "@avalanche-sdk/devtools/models/components";

let value: CompositeQueryResponse = {
  subQueryCounts: {
    "1": 1,
    "2": 2,
    "3": 2,
  },
  totalCount: 2,
  addresses: [
    "0x1234567890abcdef1234567890abcdef123456789",
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            | Example                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |                                                                                                                                        |
| `subQueryCounts`                                                                                                                       | Record<string, *number*>                                                                                                               | :heavy_check_mark:                                                                                                                     | The number of results for each subquery by query id.                                                                                   | {<br/>"1": 1,<br/>"2": 2,<br/>"3": 2<br/>}                                                                                             |
| `totalCount`                                                                                                                           | *number*                                                                                                                               | :heavy_check_mark:                                                                                                                     | The total number of addresses returned by the composite query.                                                                         | 2                                                                                                                                      |
| `addresses`                                                                                                                            | *string*[]                                                                                                                             | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |                                                                                                                                        |