# ListInternalTransactionsResponse

## Example Usage

```typescript
import { ListInternalTransactionsResponse } from "@avalanche-sdk/devtools/models/components";

let value: ListInternalTransactionsResponse = {
  transactions: [
    {
      from: "0x737F6b0b8A04e8462d0fC7076451298F0dA9a972",
      to: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      internalTxType: "call",
      value: "50000000000000000",
      gasUsed: "44038",
      gasLimit: "50000",
      transactionHash:
        "0xfd91150d236ec5c3b1ee325781affad5b0b4d7eb0187c84c220ab115eaa563e8",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `transactions`                                                                                                                         | [components.InternalTransaction](../../models/components/internaltransaction.md)[]                                                     | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |