# ListL1ValidatorsResponse

## Example Usage

```typescript
import { ListL1ValidatorsResponse } from "@avalanche-sdk/devtools/models/components";

let value: ListL1ValidatorsResponse = {
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
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `validators`                                                                                                                           | [components.L1ValidatorDetailsFull](../../models/components/l1validatordetailsfull.md)[]                                               | :heavy_check_mark:                                                                                                                     | The list of L1 validations for the given Subnet ID, NodeId or validationId                                                             |
| `blockHeight`                                                                                                                          | *string*                                                                                                                               | :heavy_check_mark:                                                                                                                     | Block height at which the L1 validator's remaining balance is calculated                                                               |