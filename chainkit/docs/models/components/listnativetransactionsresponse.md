# ListNativeTransactionsResponse

## Example Usage

```typescript
import { ListNativeTransactionsResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ListNativeTransactionsResponse = {
  transactions: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `transactions`                                                                                                                         | [components.NativeTransaction](../../models/components/nativetransaction.md)[]                                                         | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |