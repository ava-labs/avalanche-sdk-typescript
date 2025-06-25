# ListAssetTransactionsRequest

## Example Usage

```typescript
import { ListAssetTransactionsRequest } from "@avalanche-sdk/devtools/models/operations";

let value: ListAssetTransactionsRequest = {
  txTypes: [
    "AddValidatorTx",
  ],
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
  blockchainId: "x-chain",
  assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     | Example                                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `txTypes`                                                                                       | [components.PrimaryNetworkTxType](../../models/components/primarynetworktxtype.md)[]            | :heavy_minus_sign:                                                                              | Query param for filtering items based on transaction types.                                     | [<br/>"AddValidatorTx"<br/>]                                                                    |
| `startTimestamp`                                                                                | *number*                                                                                        | :heavy_minus_sign:                                                                              | Query param for retrieving items after a specific timestamp.                                    | 1689541049                                                                                      |
| `endTimestamp`                                                                                  | *number*                                                                                        | :heavy_minus_sign:                                                                              | Query param for retrieving items before a specific timestamp.                                   | 1689800249                                                                                      |
| `pageToken`                                                                                     | *string*                                                                                        | :heavy_minus_sign:                                                                              | A page token, received from a previous list call. Provide this to retrieve the subsequent page. |                                                                                                 |
| `pageSize`                                                                                      | *number*                                                                                        | :heavy_minus_sign:                                                                              | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 100. | 10                                                                                              |
| `blockchainId`                                                                                  | [components.XChainId](../../models/components/xchainid.md)                                      | :heavy_check_mark:                                                                              | A primary network blockchain id or alias.                                                       | x-chain                                                                                         |
| `network`                                                                                       | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md)                  | :heavy_minus_sign:                                                                              | Either mainnet or testnet/fuji.                                                                 | mainnet                                                                                         |
| `assetId`                                                                                       | *string*                                                                                        | :heavy_check_mark:                                                                              | Asset ID for any asset on X-Chain                                                               | th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof                                               |