# GetNativeBalanceRequest

## Example Usage

```typescript
import { GetNativeBalanceRequest } from "@avalanche-sdk/sdk/models/operations";

let value: GetNativeBalanceRequest = {
  blockNumber: "6479329",
  chainId: "43114",
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  currency: "usd",
};
```

## Fields

| Field                                                                                                       | Type                                                                                                        | Required                                                                                                    | Description                                                                                                 | Example                                                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `blockNumber`                                                                                               | *string*                                                                                                    | :heavy_minus_sign:                                                                                          | The block number, if not defined the block number will be the latest block.                                 | 6479329                                                                                                     |
| `chainId`                                                                                                   | *string*                                                                                                    | :heavy_minus_sign:                                                                                          | A supported evm chain id or blockchain id. Use the `/chains` endpoint to get a list of supported chain ids. | 43114                                                                                                       |
| `address`                                                                                                   | *string*                                                                                                    | :heavy_check_mark:                                                                                          | A wallet address.                                                                                           | 0x71C7656EC7ab88b098defB751B7401B5f6d8976F                                                                  |
| `currency`                                                                                                  | [components.CurrencyCode](../../models/components/currencycode.md)                                          | :heavy_minus_sign:                                                                                          | The currency that return values should use. Defaults to USD.                                                | usd                                                                                                         |