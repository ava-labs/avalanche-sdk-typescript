# ListIcmMessagesByAddressRequest

## Example Usage

```typescript
import { ListIcmMessagesByAddressRequest } from "@avalanche-sdk/sdk/models/operations";

let value: ListIcmMessagesByAddressRequest = {
  address: "0x8578AE7723751446B196bD5124e1bF57B40EB7Bc",
  network: "mainnet",
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     | Example                                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `pageToken`                                                                                     | *string*                                                                                        | :heavy_minus_sign:                                                                              | A page token, received from a previous list call. Provide this to retrieve the subsequent page. |                                                                                                 |
| `pageSize`                                                                                      | *number*                                                                                        | :heavy_minus_sign:                                                                              | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 100. | 10                                                                                              |
| `address`                                                                                       | *string*                                                                                        | :heavy_check_mark:                                                                              | An EVM address.                                                                                 | 0x8578AE7723751446B196bD5124e1bF57B40EB7Bc                                                      |
| `network`                                                                                       | [components.Network](../../models/components/network.md)                                        | :heavy_minus_sign:                                                                              | Either mainnet or testnet/fuji.                                                                 | mainnet                                                                                         |