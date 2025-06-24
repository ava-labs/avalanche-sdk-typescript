# ListErc721TransactionsResponse

## Example Usage

```typescript
import { ListErc721TransactionsResponse } from "@avalanche-sdk/data/models/components";

let value: ListErc721TransactionsResponse = {
  transactions: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `transactions`                                                                                                                         | [components.Erc721Transfer](../../models/components/erc721transfer.md)[]                                                               | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |