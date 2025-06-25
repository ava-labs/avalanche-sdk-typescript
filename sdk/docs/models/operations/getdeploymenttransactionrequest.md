# GetDeploymentTransactionRequest

## Example Usage

```typescript
import { GetDeploymentTransactionRequest } from "@avalanche-sdk/sdk/models/operations";

let value: GetDeploymentTransactionRequest = {
  address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  currency: "usd",
};
```

## Fields

| Field                                                                                                       | Type                                                                                                        | Required                                                                                                    | Description                                                                                                 | Example                                                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `chainId`                                                                                                   | *string*                                                                                                    | :heavy_minus_sign:                                                                                          | A supported evm chain id or blockchain id. Use the `/chains` endpoint to get a list of supported chain ids. | 43114                                                                                                       |
| `address`                                                                                                   | *string*                                                                                                    | :heavy_check_mark:                                                                                          | Contract address on the relevant chain.                                                                     | 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E                                                                  |
| `currency`                                                                                                  | [components.CurrencyCode](../../models/components/currencycode.md)                                          | :heavy_minus_sign:                                                                                          | The currency that return values should use. Defaults to USD.                                                | usd                                                                                                         |