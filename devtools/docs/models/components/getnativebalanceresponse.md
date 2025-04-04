# GetNativeBalanceResponse

## Example Usage

```typescript
import { GetNativeBalanceResponse } from "@avalanche-sdk/devtools/models/components";

let value: GetNativeBalanceResponse = {
  nativeTokenBalance: {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    decimals: 18,
    logoUri:
      "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
    chainId: "43114",
    price: {
      currencyCode: "usd",
      value: 42.42,
    },
    balance: "2000000000000000000",
    balanceValue: {
      currencyCode: "usd",
      value: 42.42,
    },
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `nativeTokenBalance`                                                           | [components.NativeTokenBalance](../../models/components/nativetokenbalance.md) | :heavy_check_mark:                                                             | The native token balance for the address.                                      |