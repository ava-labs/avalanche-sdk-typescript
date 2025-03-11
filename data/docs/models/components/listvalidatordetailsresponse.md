# ListValidatorDetailsResponse

## Example Usage

```typescript
import { ListValidatorDetailsResponse } from "@avalanche-sdk/data/models/components";

let value: ListValidatorDetailsResponse = {
  validators: [
    {
      txHash: "<value>",
      nodeId: "<id>",
      subnetId: "<id>",
      amountStaked: "<value>",
      startTimestamp: 4287.96,
      endTimestamp: 680.74,
      stakePercentage: 2519.41,
      delegatorCount: 2211.61,
      uptimePerformance: 2531.91,
      potentialRewards: {
        validationRewardAmount: "<value>",
        delegationRewardAmount: "<value>",
      },
      validationStatus: "active",
      validatorHealth: {
        reachabilityPercent: 1310.55,
        benchedPChainRequestsPercent: 120.36,
        benchedXChainRequestsPercent: 1154.84,
        benchedCChainRequestsPercent: 6184.8,
      },
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `validators`                                                                                                                           | *components.Validator*[]                                                                                                               | :heavy_check_mark:                                                                                                                     | The list of validator Details.                                                                                                         |