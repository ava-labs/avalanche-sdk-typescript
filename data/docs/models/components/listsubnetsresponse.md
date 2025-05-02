# ListSubnetsResponse

## Example Usage

```typescript
import { ListSubnetsResponse } from "@avalanche-sdk/data/models/components";

let value: ListSubnetsResponse = {
  subnets: [
    {
      createBlockTimestamp: 1917.99,
      createBlockIndex: "<value>",
      subnetId: "<id>",
      ownerAddresses: [
        "<value>",
      ],
      threshold: 151.67,
      locktime: 5713.2,
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
          createBlockTimestamp: 240.01,
          createBlockNumber: "<value>",
          blockchainId: "<id>",
          vmId: "<id>",
          subnetId: "<id>",
          blockchainName: "<value>",
          evmChainId: 43114,
        },
      ],
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `subnets`                                                                                                                              | [components.Subnet](../../models/components/subnet.md)[]                                                                               | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |