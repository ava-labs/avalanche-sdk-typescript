# GetNetworkDetailsResponse

## Example Usage

```typescript
import { GetNetworkDetailsResponse } from "@avalanche-sdk/data/models/components";

let value: GetNetworkDetailsResponse = {
  validatorDetails: {
    validatorCount: 5215.83,
    totalAmountStaked: "<value>",
    estimatedAnnualStakingReward: "<value>",
    stakingDistributionByVersion: [],
    stakingRatio: "<value>",
  },
  delegatorDetails: {
    delegatorCount: 4840.59,
    totalAmountStaked: "<value>",
  },
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `validatorDetails`                                                           | [components.ValidatorsDetails](../../models/components/validatorsdetails.md) | :heavy_check_mark:                                                           | N/A                                                                          |
| `delegatorDetails`                                                           | [components.DelegatorsDetails](../../models/components/delegatorsdetails.md) | :heavy_check_mark:                                                           | N/A                                                                          |