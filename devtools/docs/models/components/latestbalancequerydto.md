# LatestBalanceQueryDto

## Example Usage

```typescript
import { LatestBalanceQueryDto } from "@avalanche-sdk/devtools/models/components";

let value: LatestBalanceQueryDto = {
  id: "<id>",
  type: "LatestBalance",
  params: {
    minBalance: "<value>",
    evmChainId: "<id>",
    tokenType: "ERC20",
  },
};
```

## Fields

| Field                                                                                        | Type                                                                                         | Required                                                                                     | Description                                                                                  |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `id`                                                                                         | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `type`                                                                                       | [components.LatestBalanceQueryDtoType](../../models/components/latestbalancequerydtotype.md) | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `params`                                                                                     | [components.LatestBalanceParams](../../models/components/latestbalanceparams.md)             | :heavy_check_mark:                                                                           | N/A                                                                                          |