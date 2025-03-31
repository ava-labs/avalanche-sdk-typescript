# GetBlockByIdRequest

## Example Usage

```typescript
import { GetBlockByIdRequest } from "@avalanche-sdk/sdk/data/models/operations";

let value: GetBlockByIdRequest = {
  blockchainId: "p-chain",
  network: "mainnet",
  blockId: "5615di9ytxujackzaXNrVuWQy5y8Yrt8chPCscMr5Ku9YxJ1S",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `blockchainId`                                                                 | [components.BlockchainId](../../models/components/blockchainid.md)             | :heavy_check_mark:                                                             | A primary network blockchain id or alias.                                      | p-chain                                                                        |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | Either mainnet or testnet/fuji.                                                | mainnet                                                                        |
| `blockId`                                                                      | *string*                                                                       | :heavy_check_mark:                                                             | A block identifier which is either a block number or the block hash.           | 5615di9ytxujackzaXNrVuWQy5y8Yrt8chPCscMr5Ku9YxJ1S                              |