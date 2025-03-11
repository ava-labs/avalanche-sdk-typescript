# ListLatestPrimaryNetworkBlocksRequest

## Example Usage

```typescript
import { ListLatestPrimaryNetworkBlocksRequest } from "@avalanche-sdk/data/models/operations";

let value: ListLatestPrimaryNetworkBlocksRequest = {
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
  blockchainId: "p-chain",
  network: "mainnet",
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     | Example                                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `startTimestamp`                                                                                | *number*                                                                                        | :heavy_minus_sign:                                                                              | Query param for retrieving items after a specific timestamp.                                    | 1689541049                                                                                      |
| `endTimestamp`                                                                                  | *number*                                                                                        | :heavy_minus_sign:                                                                              | Query param for retrieving items before a specific timestamp.                                   | 1689800249                                                                                      |
| `pageToken`                                                                                     | *string*                                                                                        | :heavy_minus_sign:                                                                              | A page token, received from a previous list call. Provide this to retrieve the subsequent page. |                                                                                                 |
| `pageSize`                                                                                      | *number*                                                                                        | :heavy_minus_sign:                                                                              | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 100. | 10                                                                                              |
| `blockchainId`                                                                                  | [components.BlockchainId](../../models/components/blockchainid.md)                              | :heavy_check_mark:                                                                              | A primary network blockchain id or alias.                                                       | p-chain                                                                                         |
| `network`                                                                                       | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md)                  | :heavy_minus_sign:                                                                              | Either mainnet or testnet/fuji.                                                                 | mainnet                                                                                         |