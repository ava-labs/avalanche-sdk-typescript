# ListPendingRewardsResponse

## Example Usage

```typescript
import { ListPendingRewardsResponse } from "@avalanche-sdk/sdk/data/models/components";

let value: ListPendingRewardsResponse = {
  pendingRewards: [
    {
      addresses: [
        "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
      ],
      txHash: "<value>",
      amountStaked: "<value>",
      nodeId: "<id>",
      startTimestamp: 7214.07,
      endTimestamp: 6375.83,
      rewardType: "VALIDATOR_FEE",
      progress: 9762.26,
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