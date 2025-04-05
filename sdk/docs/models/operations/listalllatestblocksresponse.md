# ListAllLatestBlocksResponse

## Example Usage

```typescript
import { ListAllLatestBlocksResponse } from "@avalanche-sdk/sdk/models/operations";

let value: ListAllLatestBlocksResponse = {
  result: {
    blocks: [
      {
        chainId: "43114",
        blockNumber: "339",
        blockTimestamp: 1648672486,
        blockHash:
          "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
        txCount: 2053.97,
        baseFee: "<value>",
        gasUsed: "<value>",
        gasLimit: "<value>",
        gasCost: "<value>",
        parentHash: "<value>",
        feesSpent: "<value>",
        cumulativeTransactions: "<value>",
      },
    ],
  },
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `result`                                                                             | [components.ListEvmBlocksResponse](../../models/components/listevmblocksresponse.md) | :heavy_check_mark:                                                                   | N/A                                                                                  |