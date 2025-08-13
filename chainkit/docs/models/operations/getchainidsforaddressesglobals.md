# GetChainIdsForAddressesGlobals

## Example Usage

```typescript
import { GetChainIdsForAddressesGlobals } from "@avalanche-sdk/chainkit/models/operations";

let value: GetChainIdsForAddressesGlobals = {
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | A supported network type mainnet or testnet/fuji.                              | mainnet                                                                        |