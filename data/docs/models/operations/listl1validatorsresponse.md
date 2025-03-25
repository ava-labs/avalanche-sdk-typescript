# ListL1ValidatorsResponse

## Example Usage

```typescript
import { ListL1ValidatorsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListL1ValidatorsResponse = {
  result: {
    validators: [
      {
        validationId: "<id>",
        validationIdHex: "<value>",
        nodeId: "<id>",
        subnetId: "<id>",
        weight: 4589.7,
        remainingBalance: 3223.33,
        creationTimestamp: 3165.01,
        blsCredentials: {},
        remainingBalanceOwner: {
          addresses: [
            "<value>",
          ],
          threshold: 4825.84,
        },
        deactivationOwner: {
          addresses: [
            "<value>",
          ],
          threshold: 7298.28,
        },
      },
    ],
  },
};
```

## Fields

| Field                                                                                      | Type                                                                                       | Required                                                                                   | Description                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `result`                                                                                   | [components.ListL1ValidatorsResponse](../../models/components/listl1validatorsresponse.md) | :heavy_check_mark:                                                                         | N/A                                                                                        |