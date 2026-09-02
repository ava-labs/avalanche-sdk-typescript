# ListActivePrimaryNetworkStakingTransactionsResponse

## Example Usage

```typescript
import { ListActivePrimaryNetworkStakingTransactionsResponse } from "@avalanche-sdk/chainkit/models/operations";

let value: ListActivePrimaryNetworkStakingTransactionsResponse = {
  result: {
    transactions: [],
    chainInfo: {
      chainName: "c-chain",
      network: "mainnet",
    },
  },
};
```

## Fields

| Field                                                                                                                | Type                                                                                                                 | Required                                                                                                             | Description                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `result`                                                                                                             | [components.ListPChainStakingTransactionsResponse](../../models/components/listpchainstakingtransactionsresponse.md) | :heavy_check_mark:                                                                                                   | N/A                                                                                                                  |