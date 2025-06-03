# ListBlockchainsResponse

## Example Usage

```typescript
import { ListBlockchainsResponse } from "@avalanche-sdk/sdk/models/components";

let value: ListBlockchainsResponse = {
  blockchains: [
    {
      createBlockTimestamp: 1223.42,
      createBlockNumber: "<value>",
      blockchainId: "<id>",
      vmId: "<id>",
      subnetId: "<id>",
      blockchainName: "<value>",
      evmChainId: 43114,
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `blockchains`                                                                                                                          | [components.Blockchain](../../models/components/blockchain.md)[]                                                                       | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |