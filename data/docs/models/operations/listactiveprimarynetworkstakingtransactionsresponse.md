# ListActivePrimaryNetworkStakingTransactionsResponse

## Example Usage

```typescript
import { ListActivePrimaryNetworkStakingTransactionsResponse } from "@avalanche-sdk/data/models/operations";

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

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `result`                                                                                               | [components.ListPChainTransactionsResponse](../../models/components/listpchaintransactionsresponse.md) | :heavy_check_mark:                                                                                     | N/A                                                                                                    |