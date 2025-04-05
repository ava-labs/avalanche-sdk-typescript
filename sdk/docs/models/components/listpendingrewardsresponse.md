# ListPendingRewardsResponse

## Example Usage

```typescript
import { ListPendingRewardsResponse } from "@avalanche-sdk/sdk/models/components";

let value: ListPendingRewardsResponse = {
  pendingRewards: [
    {
      addresses: [
        "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
      ],
      txHash: "<value>",
      amountStaked: "<value>",
      nodeId: "<id>",
      startTimestamp: 9470.65,
      endTimestamp: 3021.53,
      rewardType: "VALIDATOR_FEE",
      progress: 280.42,
      estimatedReward: {
        assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
        name: "Avalanche",
        symbol: "AVAX",
        denomination: 9,
        type: "nft",
        amount: "5001000",
      },
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `pendingRewards`                                                                                                                       | [components.PendingReward](../../models/components/pendingreward.md)[]                                                                 | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |