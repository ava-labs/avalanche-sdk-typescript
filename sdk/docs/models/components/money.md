# Money

## Example Usage

```typescript
import { Money } from "@avalanche-sdk/sdk/models/components";

let value: Money = {
  currencyCode: "usd",
  value: 42.42,
};
```

## Fields

| Field                                                              | Type                                                               | Required                                                           | Description                                                        | Example                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `currencyCode`                                                     | [components.CurrencyCode](../../models/components/currencycode.md) | :heavy_check_mark:                                                 | ISO 4217 currency code.                                            | usd                                                                |
| `value`                                                            | *number*                                                           | :heavy_check_mark:                                                 | Monetary value in base 10 decimals.                                | 42.42                                                              |