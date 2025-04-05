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
        weight: 5601.59,
        remainingBalance: 5368.44,
        creationTimestamp: 7020.98,
        blsCredentials: {},
        remainingBalanceOwner: {
          addresses: [
            "<value>",
          ],
          threshold: 5485.65,
        },
        deactivationOwner: {
          addresses: [
            "<value>",
          ],
          threshold: 6691.95,
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