# ListCollectibleBalancesResponse

## Example Usage

```typescript
import { ListCollectibleBalancesResponse } from "@avalanche-sdk/sdk/data/models/operations";

let value: ListCollectibleBalancesResponse = {
  result: {
    collectibleBalances: [
      {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        name: "Wrapped AVAX",
        symbol: "WAVAX",
        ercType: "ERC-721",
        tokenId: "<id>",
        tokenUri: "https://unripe-babushka.org/",
        metadata: {
          indexStatus: "MISSING_TOKEN",
        },
        ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        chainId: "43114",
      },
    ],
  },
};
```

## Fields

| Field                                                                                                    | Type                                                                                                     | Required                                                                                                 | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `result`                                                                                                 | [components.ListCollectibleBalancesResponse](../../models/components/listcollectiblebalancesresponse.md) | :heavy_check_mark:                                                                                       | N/A                                                                                                      |