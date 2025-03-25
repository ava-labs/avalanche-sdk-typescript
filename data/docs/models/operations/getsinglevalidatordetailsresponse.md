# GetSingleValidatorDetailsResponse

## Example Usage

```typescript
import { GetSingleValidatorDetailsResponse } from "@avalanche-sdk/data/models/operations";

let value: GetSingleValidatorDetailsResponse = {
  result: {
    validators: [
      {
        txHash: "<value>",
        nodeId: "<id>",
        subnetId: "<id>",
        amountStaked: "<value>",
        startTimestamp: 9738.19,
        endTimestamp: 1623.58,
        stakePercentage: 2908.41,
        delegatorCount: 1797.95,
        uptimePerformance: 3455.06,
        potentialRewards: {
          validationRewardAmount: "<value>",
          delegationRewardAmount: "<value>",
        },
        validationStatus: "active",
        validatorHealth: {
          reachabilityPercent: 4800.61,
          benchedPChainRequestsPercent: 5221.76,
          benchedXChainRequestsPercent: 8536.06,
          benchedCChainRequestsPercent: 8894.48,
        },
      },
    ],
  },
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `result`                                                                                           | [components.ListValidatorDetailsResponse](../../models/components/listvalidatordetailsresponse.md) | :heavy_check_mark:                                                                                 | N/A                                                                                                |