# GetChainInfoGlobals

## Example Usage

```typescript
import { GetChainInfoGlobals } from "@avalanche-sdk/data/models/operations";

let value: GetChainInfoGlobals = {
  chainId: "43114",
};
```

## Fields

| Field                                                    | Type                                                     | Required                                                 | Description                                              | Example                                                  |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `chainId`                                                | *string*                                                 | :heavy_minus_sign:                                       | A supported EVM chain id, chain alias, or blockchain id. | 43114                                                    |