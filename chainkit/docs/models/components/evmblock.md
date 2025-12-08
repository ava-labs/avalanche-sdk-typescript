# EvmBlock

## Example Usage

```typescript
import { EvmBlock } from "@avalanche-sdk/chainkit/models/components";

let value: EvmBlock = {
  chainId: "43114",
  blockNumber: "339",
  blockTimestamp: 1648672486,
  blockTimestampMilliseconds: 1648672486000,
  blockMinDelayExcess: 7477290,
  blockHash:
    "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
  txCount: 4089.02,
  baseFee: "<value>",
  gasUsed: "<value>",
  gasLimit: "<value>",
  gasCost: "<value>",
  parentHash: "<value>",
  feesSpent: "<value>",
  cumulativeTransactions: "<value>",
};
```

## Fields

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    | Example                                                                                        |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `chainId`                                                                                      | *string*                                                                                       | :heavy_check_mark:                                                                             | The EVM chain ID on which the block was created.                                               | 43114                                                                                          |
| `blockNumber`                                                                                  | *string*                                                                                       | :heavy_check_mark:                                                                             | The block number on the chain.                                                                 | 339                                                                                            |
| `blockTimestamp`                                                                               | *number*                                                                                       | :heavy_check_mark:                                                                             | The block creation (proposal) timestamp in seconds                                             | 1648672486                                                                                     |
| `blockTimestampMilliseconds`                                                                   | *number*                                                                                       | :heavy_minus_sign:                                                                             | The block creation (proposal) timestamp in milliseconds. Available only after Granite upgrade. | 1648672486000                                                                                  |
| `blockMinDelayExcess`                                                                          | *number*                                                                                       | :heavy_minus_sign:                                                                             | Minimum block delay in milliseconds. Available only after Granite upgrade.                     | 7477290                                                                                        |
| `blockHash`                                                                                    | *string*                                                                                       | :heavy_check_mark:                                                                             | The block hash identifier.                                                                     | 0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c                             |
| `txCount`                                                                                      | *number*                                                                                       | :heavy_check_mark:                                                                             | The number of evm transactions in the block.                                                   |                                                                                                |
| `baseFee`                                                                                      | *string*                                                                                       | :heavy_check_mark:                                                                             | The base gas fee for a transaction to be included in the block.                                |                                                                                                |
| `gasUsed`                                                                                      | *string*                                                                                       | :heavy_check_mark:                                                                             | The gas used for transactions in the block.                                                    |                                                                                                |
| `gasLimit`                                                                                     | *string*                                                                                       | :heavy_check_mark:                                                                             | The total gas limit set for transactions in the block.                                         |                                                                                                |
| `gasCost`                                                                                      | *string*                                                                                       | :heavy_check_mark:                                                                             | N/A                                                                                            |                                                                                                |
| `parentHash`                                                                                   | *string*                                                                                       | :heavy_check_mark:                                                                             | The hash of the parent block.                                                                  |                                                                                                |
| `feesSpent`                                                                                    | *string*                                                                                       | :heavy_check_mark:                                                                             | The amount of fees spent/burned for transactions in the block.                                 |                                                                                                |
| `cumulativeTransactions`                                                                       | *string*                                                                                       | :heavy_check_mark:                                                                             | The cumulative number of transactions for the chain including this block.                      |                                                                                                |