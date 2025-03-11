# AnyTimeNativeBalanceQueryDto

## Example Usage

```typescript
import { AnyTimeNativeBalanceQueryDto } from "@avalanche-sdk/metrics/models/components";

let value: AnyTimeNativeBalanceQueryDto = {
  id: "<id>",
  type: "AnyTimeNativeBalance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    evmChainId: "<id>",
  },
};
```

## Fields

| Field                                                                                      | Type                                                                                       | Required                                                                                   | Description                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `id`                                                                                       | *string*                                                                                   | :heavy_check_mark:                                                                         | N/A                                                                                        |
| `type`                                                                                     | [components.TypeAnyTimeNativeBalance](../../models/components/typeanytimenativebalance.md) | :heavy_check_mark:                                                                         | N/A                                                                                        |
| `params`                                                                                   | [components.DateRangeMinBalanceParam](../../models/components/daterangeminbalanceparam.md) | :heavy_check_mark:                                                                         | N/A                                                                                        |