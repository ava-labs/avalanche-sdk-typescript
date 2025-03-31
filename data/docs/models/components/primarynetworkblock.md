# PrimaryNetworkBlock

## Example Usage

```typescript
import { PrimaryNetworkBlock } from "@avalanche-sdk/data/models/components";

let value: PrimaryNetworkBlock = {
  blockNumber: "<value>",
  blockHash: "<value>",
  parentHash: "<value>",
  blockTimestamp: 4564.1,
  blockType: "<value>",
  txCount: 1533.69,
  transactions: [
    "<value>",
  ],
  blockSizeBytes: 1995.96,
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `blockNumber`                                                            | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `blockHash`                                                              | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `parentHash`                                                             | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `blockTimestamp`                                                         | *number*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `blockType`                                                              | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `txCount`                                                                | *number*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `transactions`                                                           | *string*[]                                                               | :heavy_check_mark:                                                       | N/A                                                                      |
| `blockSizeBytes`                                                         | *number*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `l1ValidatorsAccruedFees`                                                | *number*                                                                 | :heavy_minus_sign:                                                       | N/A                                                                      |
| `activeL1Validators`                                                     | *number*                                                                 | :heavy_minus_sign:                                                       | N/A                                                                      |
| `currentSupply`                                                          | *string*                                                                 | :heavy_minus_sign:                                                       | N/A                                                                      |
| `proposerDetails`                                                        | [components.ProposerDetails](../../models/components/proposerdetails.md) | :heavy_minus_sign:                                                       | N/A                                                                      |