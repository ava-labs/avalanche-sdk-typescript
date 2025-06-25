# GetChainRequest

## Example Usage

```typescript
import { GetChainRequest } from "@avalanche-sdk/devtools/models/operations";

let value: GetChainRequest = {};
```

## Fields

| Field                                                                                      | Type                                                                                       | Required                                                                                   | Description                                                                                | Example                                                                                    |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `chainId`                                                                                  | *string*                                                                                   | :heavy_minus_sign:                                                                         | A supported evm chain id. Use the `/chains` endpoint to get a list of supported chain ids. | 43114                                                                                      |