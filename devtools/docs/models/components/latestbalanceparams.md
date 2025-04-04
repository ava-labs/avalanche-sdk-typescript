# LatestBalanceParams

## Example Usage

```typescript
import { LatestBalanceParams } from "@avalanche-sdk/devtools/models/components";

let value: LatestBalanceParams = {
  minBalance: "<value>",
  evmChainId: "<id>",
  tokenType: "NATIVE",
};
```

## Fields

| Field                                                        | Type                                                         | Required                                                     | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `minBalance`                                                 | *string*                                                     | :heavy_check_mark:                                           | N/A                                                          |
| `evmChainId`                                                 | *string*                                                     | :heavy_check_mark:                                           | N/A                                                          |
| `tokenType`                                                  | [components.TokenType](../../models/components/tokentype.md) | :heavy_check_mark:                                           | N/A                                                          |
| `contractAddress`                                            | *string*                                                     | :heavy_minus_sign:                                           | N/A                                                          |