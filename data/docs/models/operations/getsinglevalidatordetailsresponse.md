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
        startTimestamp: 8659.46,
        endTimestamp: 4413.21,
        stakePercentage: 4864.1,
        delegatorCount: 4483.69,
        uptimePerformance: 5678.46,
        potentialRewards: {
          validationRewardAmount: "<value>",
          delegationRewardAmount: "<value>",
        },
        validationStatus: "active",
        validatorHealth: {
          reachabilityPercent: 6211.69,
          benchedPChainRequestsPercent: 4981.8,
          benchedXChainRequestsPercent: 8667.89,
          benchedCChainRequestsPercent: 6277.35,
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