# EVMOutput

## Example Usage

```typescript
import { EVMOutput } from "@avalanche-sdk/sdk/data/models/components";

let value: EVMOutput = {
  toAddress: "0xD0f2898e49d941D6d479B381d3C8F0bd8d983b4c",
  asset: {
    assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
    name: "Avalanche",
    symbol: "AVAX",
    denomination: 9,
    type: "secp256k1",
    amount: "5001000",
  },
};
```

## Fields

| Field                                                            | Type                                                             | Required                                                         | Description                                                      | Example                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `toAddress`                                                      | *string*                                                         | :heavy_check_mark:                                               | EVM address to which the asset is imported in ImportTx           | 0xD0f2898e49d941D6d479B381d3C8F0bd8d983b4c                       |
| `asset`                                                          | [components.AssetAmount](../../models/components/assetamount.md) | :heavy_check_mark:                                               | AssetAmount details for the asset being transferred.             |                                                                  |