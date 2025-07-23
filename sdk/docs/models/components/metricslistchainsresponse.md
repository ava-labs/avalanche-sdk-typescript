# MetricsListChainsResponse

## Example Usage

```typescript
import { MetricsListChainsResponse } from "@avalanche-sdk/sdk/models/components";

let value: MetricsListChainsResponse = {
  chains: [
    {
      evmChainId: 43114,
      chainName: "c_chain",
      blockchainId: "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5",
      subnetId: "11111111111111111111111111111111LpoYY",
      network: "mainnet",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `chains`                                                                                                                               | [components.Chain](../../models/components/chain.md)[]                                                                                 | :heavy_check_mark:                                                                                                                     | Array of Subnet - EVM Chain ID mappings whose metrics we support.                                                                      |