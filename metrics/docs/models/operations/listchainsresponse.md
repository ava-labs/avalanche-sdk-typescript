# ListChainsResponse

## Example Usage

```typescript
import { ListChainsResponse } from "@avalanche-sdk/metrics/models/operations";

let value: ListChainsResponse = {
  result: {
    chains: [
      {
        evmChainId: 43114,
        chainName: "c_chain",
        blockchainId: "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5",
        subnetId: "11111111111111111111111111111111LpoYY",
        network: "mainnet",
      },
    ],
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `result`                                                                       | [components.ListChainsResponse](../../models/components/listchainsresponse.md) | :heavy_check_mark:                                                             | N/A                                                                            |