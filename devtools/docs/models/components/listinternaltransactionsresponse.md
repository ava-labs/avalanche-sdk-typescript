# ListInternalTransactionsResponse

## Example Usage

```typescript
import { ListInternalTransactionsResponse } from "@avalanche-sdk/devtools/models/components";

let value: ListInternalTransactionsResponse = {
  transactions: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `transactions`                                                                                                                         | [components.InternalTransaction](../../models/components/internaltransaction.md)[]                                                     | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |