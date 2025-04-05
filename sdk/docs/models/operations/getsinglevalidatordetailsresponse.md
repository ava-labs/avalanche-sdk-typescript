# GetSingleValidatorDetailsResponse

## Example Usage

```typescript
import { GetSingleValidatorDetailsResponse } from "@avalanche-sdk/sdk/models/operations";

let value: GetSingleValidatorDetailsResponse = {
  result: {
    validators: [
      {
        txHash: "<value>",
        nodeId: "<id>",
        subnetId: "<id>",
        amountStaked: "<value>",
        startTimestamp: 5902.32,
        endTimestamp: 8589.49,
        stakePercentage: 1534.92,
        delegatorCount: 6195.7,
        uptimePerformance: 4943.38,
        potentialRewards: {
          validationRewardAmount: "<value>",
          delegationRewardAmount: "<value>",
        },
        validationStatus: "active",
        validatorHealth: {
          reachabilityPercent: 1837.02,
          benchedPChainRequestsPercent: 5929.16,
          benchedXChainRequestsPercent: 2784.05,
          benchedCChainRequestsPercent: 2074.4,
        },
        geolocation: {
          city: "Gibsonbury",
          country: "Cook Islands",
          countryCode: "BZ",
          latitude: 3645.19,
          longitude: 4153.12,
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