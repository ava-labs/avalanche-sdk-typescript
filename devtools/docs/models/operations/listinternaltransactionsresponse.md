# ListInternalTransactionsResponse

## Example Usage

```typescript
import { ListInternalTransactionsResponse } from "@avalanche-sdk/devtools/models/operations";

let value: ListInternalTransactionsResponse = {
  result: {
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
  },
};
```

## Fields

| Field                                                                                                      | Type                                                                                                       | Required                                                                                                   | Description                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `result`                                                                                                   | [components.ListInternalTransactionsResponse](../../models/components/listinternaltransactionsresponse.md) | :heavy_check_mark:                                                                                         | N/A                                                                                                        |