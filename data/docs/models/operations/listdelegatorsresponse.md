# ListDelegatorsResponse

## Example Usage

```typescript
import { ListDelegatorsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListDelegatorsResponse = {
  result: {
    delegators: [
      {
        txHash: "<value>",
        nodeId: "<id>",
        rewardAddresses: [
          "<value>",
        ],
        amountDelegated: "<value>",
        delegationFee: "<value>",
        startTimestamp: 9149.71,
        endTimestamp: 7317.44,
        estimatedGrossReward: "<value>",
        estimatedNetReward: "<value>",
        delegationStatus: "pending",
      },
    ],
  },
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `result`                                                                                           | [components.ListDelegatorDetailsResponse](../../models/components/listdelegatordetailsresponse.md) | :heavy_check_mark:                                                                                 | N/A                                                                                                |