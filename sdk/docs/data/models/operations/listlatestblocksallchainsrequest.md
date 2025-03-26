# ListLatestBlocksAllChainsRequest

## Example Usage

```typescript
import { ListLatestBlocksAllChainsRequest } from "@avalanche-sdk/sdk/data/models/operations";

let value: ListLatestBlocksAllChainsRequest = {
  network: "mainnet",
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     | Example                                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `pageToken`                                                                                     | *string*                                                                                        | :heavy_minus_sign:                                                                              | A page token, received from a previous list call. Provide this to retrieve the subsequent page. |                                                                                                 |
| `pageSize`                                                                                      | *number*                                                                                        | :heavy_minus_sign:                                                                              | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 100. | 10                                                                                              |
| `network`                                                                                       | [components.Network](../../models/components/network.md)                                        | :heavy_minus_sign:                                                                              | Either mainnet or testnet/fuji.                                                                 | mainnet                                                                                         |