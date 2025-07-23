# ListL1ValidatorsResponse

## Example Usage

```typescript
import { ListL1ValidatorsResponse } from "@avalanche-sdk/sdk/models/operations";

let value: ListL1ValidatorsResponse = {
  result: {
    validators: [
      {
        validationId: "<id>",
        validationIdHex: "<value>",
        nodeId: "<id>",
        subnetId: "<id>",
        weight: 5368.44,
        remainingBalance: 7020.98,
        creationTimestamp: 5485.65,
        blsCredentials: {},
        remainingBalanceOwner: {
          addresses: [
            "<value 1>",
            "<value 2>",
          ],
          threshold: 7038.52,
        },
        deactivationOwner: {
          addresses: [
            "<value 1>",
          ],
          threshold: 4642.49,
        },
      },
    ],
    blockHeight: "<value>",
  },
};
```

## Fields

| Field                                                                                      | Type                                                                                       | Required                                                                                   | Description                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `result`                                                                                   | [components.ListL1ValidatorsResponse](../../models/components/listl1validatorsresponse.md) | :heavy_check_mark:                                                                         | N/A                                                                                        |