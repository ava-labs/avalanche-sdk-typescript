# LatestStarsArenaBalanceQueryDto

## Example Usage

```typescript
import { LatestStarsArenaBalanceQueryDto } from "@avalanche-sdk/metrics/models/components";

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

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `id`                                                                                                 | *string*                                                                                             | :heavy_check_mark:                                                                                   | N/A                                                                                                  |
| `type`                                                                                               | [components.TypeLatestBalanceStarsArena](../../models/components/typelatestbalancestarsarena.md)     | :heavy_check_mark:                                                                                   | N/A                                                                                                  |
| `params`                                                                                             | [components.LatestStarsArenaBalanceParams](../../models/components/lateststarsarenabalanceparams.md) | :heavy_check_mark:                                                                                   | N/A                                                                                                  |