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
        startTimestamp: 4166.92,
        endTimestamp: 8108.39,
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