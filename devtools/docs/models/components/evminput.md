# EVMInput

## Example Usage

```typescript
import { EVMInput } from "@avalanche-sdk/devtools/models/components";

let value: EVMInput = {
  fromAddress: "0xD0f2898e49d941D6d479B381d3C8F0bd8d983b4c",
  asset: {
    assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
    name: "Avalanche",
    symbol: "AVAX",
    denomination: 9,
    type: "secp256k1",
    amount: "5001000",
  },
  credentials: [
    {
      signature:
        "bWWoZUu0Z3STjuk/+2az7M4vP0oqc9NtiA7kOdqINCIE/2+5va5R1KNCWwEX5jE1xVHLvAxU2LHTN5gK8m84HwA",
      publicKey: "AdMQOtubgBFFJu++0faHPIIA6KmdZ2ERErMRGzyy6juI",
    },
  ],
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              | Example                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `fromAddress`                                                            | *string*                                                                 | :heavy_check_mark:                                                       | EVM address from which the asset is exported in ExportTx.                | 0xD0f2898e49d941D6d479B381d3C8F0bd8d983b4c                               |
| `asset`                                                                  | [components.AssetAmount](../../models/components/assetamount.md)         | :heavy_check_mark:                                                       | AssetAmount details for the asset being transferred.                     |                                                                          |
| `credentials`                                                            | [components.UtxoCredential](../../models/components/utxocredential.md)[] | :heavy_check_mark:                                                       | Credentials that signed this transaction.                                |                                                                          |