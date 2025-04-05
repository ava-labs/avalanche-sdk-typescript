# Subnet

## Example Usage

```typescript
import { Subnet } from "@avalanche-sdk/sdk/models/components";

let value: Subnet = {
  createBlockTimestamp: 1836.04,
  createBlockIndex: "<value>",
  subnetId: "<id>",
  ownerAddresses: [
    "<value>",
  ],
  threshold: 6622.16,
  locktime: 94.67,
  subnetOwnershipInfo: {
    locktime: 0,
    threshold: 1,
    addresses: [
      "avax1qm2a25eytsrj235hxg6jc0mwk99tss64eqevsw",
    ],
  },
  isL1: false,
  blockchains: [
    {
      createBlockTimestamp: 7674.75,
      createBlockNumber: "<value>",
      blockchainId: "<id>",
      vmId: "<id>",
      subnetId: "<id>",
      blockchainName: "<value>",
    },
  ],
};
```

## Fields

| Field                                                                                                                                                                               | Type                                                                                                                                                                                | Required                                                                                                                                                                            | Description                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createBlockTimestamp`                                                                                                                                                              | *number*                                                                                                                                                                            | :heavy_check_mark:                                                                                                                                                                  | N/A                                                                                                                                                                                 |
| `createBlockIndex`                                                                                                                                                                  | *string*                                                                                                                                                                            | :heavy_check_mark:                                                                                                                                                                  | N/A                                                                                                                                                                                 |
| `subnetId`                                                                                                                                                                          | *string*                                                                                                                                                                            | :heavy_check_mark:                                                                                                                                                                  | N/A                                                                                                                                                                                 |
| ~~`ownerAddresses`~~                                                                                                                                                                | *string*[]                                                                                                                                                                          | :heavy_check_mark:                                                                                                                                                                  | : warning: ** DEPRECATED **: This will be removed in a future release, please migrate away from it as soon as possible.<br/><br/>This field is deprecated. Use subnetOwnershipInfo instead. |
| ~~`threshold`~~                                                                                                                                                                     | *number*                                                                                                                                                                            | :heavy_check_mark:                                                                                                                                                                  | : warning: ** DEPRECATED **: This will be removed in a future release, please migrate away from it as soon as possible.<br/><br/>This field is deprecated. Use subnetOwnershipInfo instead. |
| ~~`locktime`~~                                                                                                                                                                      | *number*                                                                                                                                                                            | :heavy_check_mark:                                                                                                                                                                  | : warning: ** DEPRECATED **: This will be removed in a future release, please migrate away from it as soon as possible.<br/><br/>This field is deprecated. Use subnetOwnershipInfo instead. |
| `subnetOwnershipInfo`                                                                                                                                                               | [components.SubnetOwnershipInfo](../../models/components/subnetownershipinfo.md)                                                                                                    | :heavy_check_mark:                                                                                                                                                                  | Latest subnet owner details for this Subnet.                                                                                                                                        |
| `isL1`                                                                                                                                                                              | *boolean*                                                                                                                                                                           | :heavy_check_mark:                                                                                                                                                                  | Whether the subnet is an L1 or not.                                                                                                                                                 |
| `l1ConversionTransactionHash`                                                                                                                                                       | *string*                                                                                                                                                                            | :heavy_minus_sign:                                                                                                                                                                  | Transaction hash of ConvertSubnetToL1Tx which converted this Subnet to L1.                                                                                                          |
| `l1ValidatorManagerDetails`                                                                                                                                                         | [components.L1ValidatorManagerDetails](../../models/components/l1validatormanagerdetails.md)                                                                                        | :heavy_minus_sign:                                                                                                                                                                  | L1 validator manager details.                                                                                                                                                       |
| `blockchains`                                                                                                                                                                       | [components.Blockchain](../../models/components/blockchain.md)[]                                                                                                                    | :heavy_check_mark:                                                                                                                                                                  | N/A                                                                                                                                                                                 |