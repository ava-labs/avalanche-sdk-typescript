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
        weight: 7275.47,
        remainingBalance: 2899.13,
        creationTimestamp: 5777.1,
        blsCredentials: {},
        remainingBalanceOwner: {
          addresses: [
            "<value>",
          ],
          threshold: 7791.8,
        },
        deactivationOwner: {
          addresses: [
            "<value>",
          ],
          threshold: 7955.91,
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