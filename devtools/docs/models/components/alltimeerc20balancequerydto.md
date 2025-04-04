# AllTimeErc20BalanceQueryDto

## Example Usage

```typescript
import { AllTimeErc20BalanceQueryDto } from "@avalanche-sdk/devtools/models/components";

let value: AllTimeErc20BalanceQueryDto = {
  id: "<id>",
  type: "AllTimeErc20Balance",
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

| Field                                                                                                    | Type                                                                                                     | Required                                                                                                 | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `id`                                                                                                     | *string*                                                                                                 | :heavy_check_mark:                                                                                       | N/A                                                                                                      |
| `type`                                                                                                   | [components.AllTimeErc20BalanceQueryDtoType](../../models/components/alltimeerc20balancequerydtotype.md) | :heavy_check_mark:                                                                                       | N/A                                                                                                      |
| `params`                                                                                                 | [components.DateRangeErc20MinBalanceParam](../../models/components/daterangeerc20minbalanceparam.md)     | :heavy_check_mark:                                                                                       | N/A                                                                                                      |