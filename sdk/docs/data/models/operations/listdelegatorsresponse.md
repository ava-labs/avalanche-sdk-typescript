# ListDelegatorsResponse

## Example Usage

```typescript
import { ListDelegatorsResponse } from "@avalanche-sdk/sdk/data/models/operations";

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
        startTimestamp: 2138.35,
        endTimestamp: 7712.26,
        grossReward: "<value>",
        netReward: "<value>",
        delegationStatus: "completed",
      },
    ],
  },
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `result`                                                                                           | [components.ListDelegatorDetailsResponse](../../models/components/listdelegatordetailsresponse.md) | :heavy_check_mark:                                                                                 | N/A                                                                                                |