# ListContractDeploymentsResponse

## Example Usage

```typescript
import { ListContractDeploymentsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListContractDeploymentsResponse = {
  result: {
    contracts: [
      {
        name: "Wrapped AVAX",
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        deploymentDetails: {
          txHash: "<value>",
          deployerAddress: "<value>",
        },
        ercType: "ERC-20",
        symbol: "WAVAX",
        decimals: 18,
      },
    ],
  },
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `result`                                                                             | [components.ListContractsResponse](../../models/components/listcontractsresponse.md) | :heavy_check_mark:                                                                   | N/A                                                                                  |