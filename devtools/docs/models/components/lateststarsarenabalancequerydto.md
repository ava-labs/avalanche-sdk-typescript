# LatestStarsArenaBalanceQueryDto

## Example Usage

```typescript
import { LatestStarsArenaBalanceQueryDto } from "@avalanche-sdk/devtools/models/components";

let value: LatestStarsArenaBalanceQueryDto = {
  id: "<id>",
  type: "LatestBalanceStarsArena",
  params: {
    minBalance: "<value>",
    subjectAddress: "<value>",
  },
};
```

## Fields

| Field                                                                                                            | Type                                                                                                             | Required                                                                                                         | Description                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`                                                                                                             | *string*                                                                                                         | :heavy_check_mark:                                                                                               | N/A                                                                                                              |
| `type`                                                                                                           | [components.LatestStarsArenaBalanceQueryDtoType](../../models/components/lateststarsarenabalancequerydtotype.md) | :heavy_check_mark:                                                                                               | N/A                                                                                                              |
| `params`                                                                                                         | [components.LatestStarsArenaBalanceParams](../../models/components/lateststarsarenabalanceparams.md)             | :heavy_check_mark:                                                                                               | N/A                                                                                                              |