# ListEvmBlocksResponse

## Example Usage

```typescript
import { ListEvmBlocksResponse } from "@avalanche-sdk/data/models/components";

let value: ListEvmBlocksResponse = {
  blocks: [
    {
      chainId: "43114",
      blockNumber: "339",
      blockTimestamp: 1648672486,
      blockHash:
        "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
      txCount: 1780.99,
      baseFee: "<value>",
      gasUsed: "<value>",
      gasLimit: "<value>",
      gasCost: "<value>",
      parentHash: "<value>",
      feesSpent: "<value>",
      cumulativeTransactions: "<value>",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `blocks`                                                                                                                               | [components.EvmBlock](../../models/components/evmblock.md)[]                                                                           | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |