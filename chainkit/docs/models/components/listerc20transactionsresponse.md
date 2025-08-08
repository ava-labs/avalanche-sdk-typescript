# ListErc20TransactionsResponse

## Example Usage

```typescript
import { ListErc20TransactionsResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ListErc20TransactionsResponse = {
  transactions: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `transactions`                                                                                                                         | [components.Erc20Transfer](../../models/components/erc20transfer.md)[]                                                                 | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |