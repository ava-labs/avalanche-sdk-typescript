# ListSubnetsResponse

## Example Usage

```typescript
import { ListSubnetsResponse } from "@avalanche-sdk/data/models/components";

let value: ListSubnetsResponse = {
  subnets: [
    {
      createBlockTimestamp: 2870.51,
      createBlockIndex: "<value>",
      subnetId: "<id>",
      ownerAddresses: [
        "<value>",
      ],
      threshold: 7065.75,
      locktime: 4148.57,
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
          createBlockTimestamp: 3605.45,
          createBlockNumber: "<value>",
          blockchainId: "<id>",
          vmId: "<id>",
          subnetId: "<id>",
          blockchainName: "<value>",
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