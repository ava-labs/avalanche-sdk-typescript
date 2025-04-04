# AnyTimeStarsArenaBalanceQueryDto

## Example Usage

```typescript
import { AnyTimeStarsArenaBalanceQueryDto } from "@avalanche-sdk/devtools/models/components";

let value: AnyTimeStarsArenaBalanceQueryDto = {
  id: "<id>",
  type: "AnyTimeStarsArenaBalance",
  params: {
    firstDate: "<value>",
    lastDate: "<value>",
    minBalance: "<value>",
    subjectAddress: "<value>",
  },
};
```

## Fields

| Field                                                                                                              | Type                                                                                                               | Required                                                                                                           | Description                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `id`                                                                                                               | *string*                                                                                                           | :heavy_check_mark:                                                                                                 | N/A                                                                                                                |
| `type`                                                                                                             | [components.AnyTimeStarsArenaBalanceQueryDtoType](../../models/components/anytimestarsarenabalancequerydtotype.md) | :heavy_check_mark:                                                                                                 | N/A                                                                                                                |
| `params`                                                                                                           | [components.DateRangeStarsArenaMinBalanceParam](../../models/components/daterangestarsarenaminbalanceparam.md)     | :heavy_check_mark:                                                                                                 | N/A                                                                                                                |