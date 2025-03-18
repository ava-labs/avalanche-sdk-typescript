# GetNetworkDetailsResponse

## Example Usage

```typescript
import { GetNetworkDetailsResponse } from "@avalanche-sdk/data/models/components";

let value: GetNetworkDetailsResponse = {
  validatorDetails: {
    validatorCount: 7963.92,
    totalAmountStaked: "<value>",
    estimatedAnnualStakingReward: "<value>",
    stakingDistributionByVersion: [
      {
        version: "<value>",
        amountStaked: "<value>",
        validatorCount: 9591.67,
      },
    ],
    stakingRatio: "<value>",
  },
  delegatorDetails: {
    delegatorCount: 4581.39,
    totalAmountStaked: "<value>",
  },
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `validatorDetails`                                                           | [components.ValidatorsDetails](../../models/components/validatorsdetails.md) | :heavy_check_mark:                                                           | N/A                                                                          |
| `delegatorDetails`                                                           | [components.DelegatorsDetails](../../models/components/delegatorsdetails.md) | :heavy_check_mark:                                                           | N/A                                                                          |