# ERCToken

## Example Usage

```typescript
import { ERCToken } from "@avalanche-sdk/webhooks/models/components";

let value: ERCToken = {
  address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
  name: "TetherToken",
  symbol: "USDt",
  decimals: 6,
  valueWithDecimals: "3331.009129",
};
```

## Fields

| Field                                      | Type                                       | Required                                   | Description                                | Example                                    |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| `address`                                  | *string*                                   | :heavy_check_mark:                         | Token contract address                     | 0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7 |
| `name`                                     | *string*                                   | :heavy_check_mark:                         | Token name                                 | TetherToken                                |
| `symbol`                                   | *string*                                   | :heavy_check_mark:                         | Token symbol                               | USDt                                       |
| `decimals`                                 | *number*                                   | :heavy_check_mark:                         | Token decimals                             | 6                                          |
| `valueWithDecimals`                        | *string*                                   | :heavy_check_mark:                         | Value including decimals                   | 3331.009129                                |