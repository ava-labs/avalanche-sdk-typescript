# ListErc1155BalancesResponse

## Example Usage

```typescript
import { ListErc1155BalancesResponse } from "@avalanche-sdk/data/models/components";

let value: ListErc1155BalancesResponse = {
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
  erc1155TokenBalances: [
    {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      ercType: "ERC-1155",
      tokenId: "<id>",
      tokenUri: "https://complete-availability.net/",
      metadata: {
        indexStatus: "UNKNOWN",
      },
      chainId: "43114",
      balance: "2000000000000000000",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `nativeTokenBalance`                                                                                                                   | [components.NativeTokenBalance](../../models/components/nativetokenbalance.md)                                                         | :heavy_check_mark:                                                                                                                     | The native token balance for the address.                                                                                              |
| `erc1155TokenBalances`                                                                                                                 | [components.Erc1155TokenBalance](../../models/components/erc1155tokenbalance.md)[]                                                     | :heavy_check_mark:                                                                                                                     | The list of ERC-1155 token balances for the address.                                                                                   |