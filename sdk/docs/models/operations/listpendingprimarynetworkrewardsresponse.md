# ListPendingPrimaryNetworkRewardsResponse

## Example Usage

```typescript
import { ListPendingPrimaryNetworkRewardsResponse } from "@avalanche-sdk/sdk/models/operations";

let value: ListPendingPrimaryNetworkRewardsResponse = {
  result: {
    pendingRewards: [
      {
        addresses: [
          "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
        ],
        txHash: "<value>",
        amountStaked: "<value>",
        nodeId: "<id>",
        startTimestamp: 7551.95,
        endTimestamp: 1187.72,
        rewardType: "VALIDATOR",
        progress: 2045.49,
        estimatedReward: {
          assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
          type: "secp256k1",
          amount: "5001000",
        },
      },
    ],
  },
};
```

## Fields

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `result`                                                                                       | [components.ListPendingRewardsResponse](../../models/components/listpendingrewardsresponse.md) | :heavy_check_mark:                                                                             | N/A                                                                                            |