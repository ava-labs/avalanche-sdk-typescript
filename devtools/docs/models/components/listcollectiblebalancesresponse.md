# ListCollectibleBalancesResponse

## Example Usage

```typescript
import { ListCollectibleBalancesResponse } from "@avalanche-sdk/devtools/models/components";

let value: ListCollectibleBalancesResponse = {
  collectibleBalances: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `collectibleBalances`                                                                                                                  | *components.CollectibleBalance*[]                                                                                                      | :heavy_check_mark:                                                                                                                     | The list of ERC-721 and ERC-1155 token balances for the address.                                                                       |