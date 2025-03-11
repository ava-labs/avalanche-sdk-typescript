# ValidatorsDetails

## Example Usage

```typescript
import { ValidatorsDetails } from "@avalanche-sdk/data/models/components";

let value: ValidatorsDetails = {
  validatorCount: 9518.75,
  totalAmountStaked: "<value>",
  estimatedAnnualStakingReward: "<value>",
  stakingDistributionByVersion: [
    {
      version: "<value>",
      amountStaked: "<value>",
      validatorCount: 5757.51,
    },
  ],
  stakingRatio: "<value>",
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `validatorCount`                                                                   | *number*                                                                           | :heavy_check_mark:                                                                 | N/A                                                                                |
| `totalAmountStaked`                                                                | *string*                                                                           | :heavy_check_mark:                                                                 | N/A                                                                                |
| `estimatedAnnualStakingReward`                                                     | *string*                                                                           | :heavy_check_mark:                                                                 | Total potential rewards from currently active validations and delegations.         |
| `stakingDistributionByVersion`                                                     | [components.StakingDistribution](../../models/components/stakingdistribution.md)[] | :heavy_check_mark:                                                                 | N/A                                                                                |
| `stakingRatio`                                                                     | *string*                                                                           | :heavy_check_mark:                                                                 | Ratio of total active stake amount to the current supply.                          |