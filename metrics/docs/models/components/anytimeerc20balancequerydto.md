# AnyTimeErc20BalanceQueryDto

## Example Usage

```typescript
import { AnyTimeErc20BalanceQueryDto } from "@avalanche-sdk/metrics/models/components";

let value: AnyTimeErc20BalanceQueryDto = {
  id: "<id>",
  type: "AnyTimeErc20Balance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    evmChainId: "<id>",
    contractAddress: "<value>",
  },
};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `id`                                                                                                 | *string*                                                                                             | :heavy_check_mark:                                                                                   | N/A                                                                                                  |
| `type`                                                                                               | [components.TypeAnyTimeErc20Balance](../../models/components/typeanytimeerc20balance.md)             | :heavy_check_mark:                                                                                   | N/A                                                                                                  |
| `params`                                                                                             | [components.DateRangeErc20MinBalanceParam](../../models/components/daterangeerc20minbalanceparam.md) | :heavy_check_mark:                                                                                   | N/A                                                                                                  |