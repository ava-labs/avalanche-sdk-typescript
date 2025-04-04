# GetLatestBlocksGlobals

## Example Usage

```typescript
import { GetLatestBlocksGlobals } from "@avalanche-sdk/devtools/models/operations";

let value: GetLatestBlocksGlobals = {
  chainId: "43114",
};
```

## Fields

| Field                                                    | Type                                                     | Required                                                 | Description                                              | Example                                                  |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `chainId`                                                | *string*                                                 | :heavy_minus_sign:                                       | A supported EVM chain id, chain alias, or blockchain id. | 43114                                                    |