# ListErc1155TransactionsResponse

## Example Usage

```typescript
import { ListErc1155TransactionsResponse } from "@avalanche-sdk/sdk/models/components";

let value: ListErc1155TransactionsResponse = {
  transactions: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `transactions`                                                                                                                         | [components.Erc1155Transfer](../../models/components/erc1155transfer.md)[]                                                             | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |