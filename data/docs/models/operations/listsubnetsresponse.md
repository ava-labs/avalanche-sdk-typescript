# ListSubnetsResponse

## Example Usage

```typescript
import { ListSubnetsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListSubnetsResponse = {
  result: {
    subnets: [
      {
        createBlockTimestamp: 2569.16,
        createBlockIndex: "<value>",
        subnetId: "<id>",
        ownerAddresses: [
          "<value>",
        ],
        threshold: 8735.57,
        locktime: 4918.92,
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
            blockchainId: "<id>",
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