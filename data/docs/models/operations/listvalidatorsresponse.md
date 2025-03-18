# ListValidatorsResponse

## Example Usage

```typescript
import { ListValidatorsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListValidatorsResponse = {
  result: {
    validators: [
      {
        txHash: "<value>",
        nodeId: "<id>",
        subnetId: "<id>",
        amountStaked: "<value>",
        startTimestamp: 1855.18,
        endTimestamp: 5326.69,
        removeTxHash: "<value>",
        removeTimestamp: 3262.69,
        validationStatus: "removed",
      },
    ],
  },
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `result`                                                                                           | [components.ListValidatorDetailsResponse](../../models/components/listvalidatordetailsresponse.md) | :heavy_check_mark:                                                                                 | N/A                                                                                                |