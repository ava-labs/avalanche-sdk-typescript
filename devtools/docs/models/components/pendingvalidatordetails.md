# PendingValidatorDetails

## Example Usage

```typescript
import { PendingValidatorDetails } from "@avalanche-sdk/devtools/models/components";

let value: PendingValidatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  subnetId: "<id>",
  amountStaked: "<value>",
  startTimestamp: 9284.04,
  endTimestamp: 5123.7,
  validationStatus: "pending",
};
```

## Fields

| Field                                                                                                                    | Type                                                                                                                     | Required                                                                                                                 | Description                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `txHash`                                                                                                                 | *string*                                                                                                                 | :heavy_check_mark:                                                                                                       | N/A                                                                                                                      |
| `nodeId`                                                                                                                 | *string*                                                                                                                 | :heavy_check_mark:                                                                                                       | N/A                                                                                                                      |
| `subnetId`                                                                                                               | *string*                                                                                                                 | :heavy_check_mark:                                                                                                       | N/A                                                                                                                      |
| `amountStaked`                                                                                                           | *string*                                                                                                                 | :heavy_check_mark:                                                                                                       | N/A                                                                                                                      |
| `delegationFee`                                                                                                          | *string*                                                                                                                 | :heavy_minus_sign:                                                                                                       | The percentage of total estimated delegator rewards allocated to validator nodes for supporting delegations.             |
| `startTimestamp`                                                                                                         | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | N/A                                                                                                                      |
| `endTimestamp`                                                                                                           | *number*                                                                                                                 | :heavy_check_mark:                                                                                                       | N/A                                                                                                                      |
| `blsCredentials`                                                                                                         | [components.BlsCredentials](../../models/components/blscredentials.md)                                                   | :heavy_minus_sign:                                                                                                       | Present for AddPermissionlessValidatorTx                                                                                 |
| `validationStatus`                                                                                                       | [components.PendingValidatorDetailsValidationStatus](../../models/components/pendingvalidatordetailsvalidationstatus.md) | :heavy_check_mark:                                                                                                       | N/A                                                                                                                      |