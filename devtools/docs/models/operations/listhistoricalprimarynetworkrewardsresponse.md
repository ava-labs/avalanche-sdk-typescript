# ListHistoricalPrimaryNetworkRewardsResponse

## Example Usage

```typescript
import { ListHistoricalPrimaryNetworkRewardsResponse } from "@avalanche-sdk/devtools/models/operations";

let value: ListHistoricalPrimaryNetworkRewardsResponse = {
  result: {
    historicalRewards: [
      {
        addresses: [
          "avax1h2ccj9f5ay5acl6tyn9mwmw32p8wref8vl8ctg",
        ],
        txHash: "<value>",
        amountStaked: "<value>",
        nodeId: "<id>",
        startTimestamp: 1347.6,
        endTimestamp: 9923.3,
        rewardType: "DELEGATOR",
        utxoId: "<id>",
        outputIndex: 1640.74,
        reward: {
          assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
          type: "secp256k1",
          amount: "5001000",
          historicalPrice: {
            currencyCode: "usd",
            value: 42.42,
          },
        },
        rewardTxHash: "<value>",
      },
    ],
  },
};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `result`                                                                                             | [components.ListHistoricalRewardsResponse](../../models/components/listhistoricalrewardsresponse.md) | :heavy_check_mark:                                                                                   | N/A                                                                                                  |