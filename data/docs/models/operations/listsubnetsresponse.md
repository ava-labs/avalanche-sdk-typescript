# ListSubnetsResponse

## Example Usage

```typescript
import { ListSubnetsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListSubnetsResponse = {
  result: {
    subnets: [
      {
        createBlockTimestamp: 7255.74,
        createBlockIndex: "<value>",
        subnetId: "<id>",
        ownerAddresses: [
          "<value>",
        ],
        threshold: 385.57,
        locktime: 7731.1,
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
            createBlockTimestamp: 2168.7,
            createBlockNumber: "<value>",
            blockchainId: "<id>",
            vmId: "<id>",
            subnetId: "<id>",
            blockchainName: "<value>",
          },
        ],
      },
    ],
  },
};
```

## Fields

| Field                                                                            | Type                                                                             | Required                                                                         | Description                                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `result`                                                                         | [components.ListSubnetsResponse](../../models/components/listsubnetsresponse.md) | :heavy_check_mark:                                                               | N/A                                                                              |