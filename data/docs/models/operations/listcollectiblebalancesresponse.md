# ListCollectibleBalancesResponse

## Example Usage

```typescript
import { ListCollectibleBalancesResponse } from "@avalanche-sdk/data/models/operations";

let value: ListCollectibleBalancesResponse = {
  result: {
    collectibleBalances: [
      {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        ercType: "ERC-1155",
        tokenId: "<id>",
        tokenUri: "https://understated-reasoning.info/",
        metadata: {
          indexStatus: "UNREACHABLE_TOKEN_URI",
        },
        chainId: "43114",
        balance: "2000000000000000000",
      },
    ],
  },
};
```

## Fields

| Field                                                                                                    | Type                                                                                                     | Required                                                                                                 | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `result`                                                                                                 | [components.ListCollectibleBalancesResponse](../../models/components/listcollectiblebalancesresponse.md) | :heavy_check_mark:                                                                                       | N/A                                                                                                      |