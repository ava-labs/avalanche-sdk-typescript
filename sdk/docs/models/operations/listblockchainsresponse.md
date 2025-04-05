# ListBlockchainsResponse

## Example Usage

```typescript
import { ListBlockchainsResponse } from "@avalanche-sdk/sdk/models/operations";

let value: ListBlockchainsResponse = {
  result: {
    blockchains: [
      {
        createBlockTimestamp: 1223.42,
        createBlockNumber: "<value>",
        blockchainId: "<id>",
        vmId: "<id>",
        subnetId: "<id>",
        blockchainName: "<value>",
      },
    ],
  },
};
```

## Fields

| Field                                                                                    | Type                                                                                     | Required                                                                                 | Description                                                                              |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `result`                                                                                 | [components.ListBlockchainsResponse](../../models/components/listblockchainsresponse.md) | :heavy_check_mark:                                                                       | N/A                                                                                      |