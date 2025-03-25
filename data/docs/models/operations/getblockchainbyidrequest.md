# GetBlockchainByIdRequest

## Example Usage

```typescript
import { GetBlockchainByIdRequest } from "@avalanche-sdk/data/models/operations";

let value: GetBlockchainByIdRequest = {
  blockchainId: "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5",
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `blockchainId`                                                                 | *string*                                                                       | :heavy_check_mark:                                                             | The blockchain ID of the blockchain to retrieve.                               | 2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5                              |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | Either mainnet or testnet/fuji.                                                | mainnet                                                                        |