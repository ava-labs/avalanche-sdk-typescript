# SubnetOwnershipInfo

## Example Usage

```typescript
import { SubnetOwnershipInfo } from "@avalanche-sdk/devtools/models/components";

let value: SubnetOwnershipInfo = {
  locktime: 0,
  threshold: 1,
  addresses: [
    "avax1qm2a25eytsrj235hxg6jc0mwk99tss64eqevsw",
  ],
};
```

## Fields

| Field                                                                         | Type                                                                          | Required                                                                      | Description                                                                   | Example                                                                       |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `locktime`                                                                    | *number*                                                                      | :heavy_check_mark:                                                            | Locktime in seconds after which Subnet owners can control this Subnet.        | 0                                                                             |
| `threshold`                                                                   | *number*                                                                      | :heavy_check_mark:                                                            | Minimum number of signatures required to sign the Subnet update transactions. | 1                                                                             |
| `addresses`                                                                   | *string*[]                                                                    | :heavy_check_mark:                                                            | Addresses that are eligible to sign the Subnet update transactions.           | [<br/>"avax1qm2a25eytsrj235hxg6jc0mwk99tss64eqevsw"<br/>]                     |