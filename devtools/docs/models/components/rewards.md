# Rewards

## Example Usage

```typescript
import { Rewards } from "@avalanche-sdk/devtools/models/components";

let value: Rewards = {
  validationRewardAmount: "<value>",
  delegationRewardAmount: "<value>",
};
```

## Fields

| Field                    | Type                     | Required                 | Description              |
| ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| `validationRewardAmount` | *string*                 | :heavy_check_mark:       | N/A                      |
| `delegationRewardAmount` | *string*                 | :heavy_check_mark:       | N/A                      |
| `rewardAddresses`        | *string*[]               | :heavy_minus_sign:       | N/A                      |
| `rewardTxHash`           | *string*                 | :heavy_minus_sign:       | N/A                      |