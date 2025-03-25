# ListL1ValidatorsResponse

## Example Usage

```typescript
import { ListL1ValidatorsResponse } from "@avalanche-sdk/data/models/components";

let value: ListL1ValidatorsResponse = {
  validators: [
    {
      validationId: "<id>",
      validationIdHex: "<value>",
      nodeId: "<id>",
      subnetId: "<id>",
      weight: 5249.7,
      remainingBalance: 7505.95,
      creationTimestamp: 3335.07,
      blsCredentials: {},
      remainingBalanceOwner: {
        addresses: [
          "<value>",
        ],
        threshold: 9241.59,
      },
      deactivationOwner: {
        addresses: [
          "<value>",
        ],
        threshold: 8623.19,
      },
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `validators`                                                                                                                           | [components.L1ValidatorDetailsFull](../../models/components/l1validatordetailsfull.md)[]                                               | :heavy_check_mark:                                                                                                                     | The list of L1 validations for the given Subnet ID, NodeId or validationId                                                             |