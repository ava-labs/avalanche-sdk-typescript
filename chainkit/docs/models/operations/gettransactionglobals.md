# GetTransactionGlobals

## Example Usage

```typescript
import { GetTransactionGlobals } from "@avalanche-sdk/chainkit/models/operations";

let value: GetTransactionGlobals = {
  chainId: "43114",
};
```

## Fields

| Field                                                    | Type                                                     | Required                                                 | Description                                              | Example                                                  |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `chainId`                                                | *string*                                                 | :heavy_minus_sign:                                       | A supported EVM chain id, chain alias, or blockchain id. | 43114                                                    |