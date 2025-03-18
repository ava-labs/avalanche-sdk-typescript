# NetworkTokenInfo

## Example Usage

```typescript
import { NetworkTokenInfo } from "@avalanche-sdk/webhooks/models/components";

let value: NetworkTokenInfo = {
  tokenName: "TetherToken",
  tokenSymbol: "USDt",
  tokenDecimals: 6,
  valueWithDecimals: "3331.009129",
};
```

## Fields

| Field                    | Type                     | Required                 | Description              | Example                  |
| ------------------------ | ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| `tokenName`              | *string*                 | :heavy_minus_sign:       | Token name               | TetherToken              |
| `tokenSymbol`            | *string*                 | :heavy_minus_sign:       | Token symbol             | USDt                     |
| `tokenDecimals`          | *number*                 | :heavy_minus_sign:       | Token decimals           | 6                        |
| `valueWithDecimals`      | *string*                 | :heavy_minus_sign:       | Value including decimals | 3331.009129              |