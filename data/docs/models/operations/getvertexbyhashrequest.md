# GetVertexByHashRequest

## Example Usage

```typescript
import { GetVertexByHashRequest } from "@avalanche-sdk/data/models/operations";

let value: GetVertexByHashRequest = {
  vertexHash: "haP1CW56cspZY7aEuqHNrtpvhqCaMTxQaYe6j5u2Mbn4L2Gqr",
  blockchainId: "x-chain",
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `vertexHash`                                                                   | *string*                                                                       | :heavy_check_mark:                                                             | A vertex hash string.                                                          | haP1CW56cspZY7aEuqHNrtpvhqCaMTxQaYe6j5u2Mbn4L2Gqr                              |
| `blockchainId`                                                                 | [components.XChainId](../../models/components/xchainid.md)                     | :heavy_check_mark:                                                             | A primary network blockchain id or alias.                                      | x-chain                                                                        |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | Either mainnet or testnet/fuji.                                                | mainnet                                                                        |