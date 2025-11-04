# GetUtxosByAddressesV2Globals

## Example Usage

```typescript
import { GetUtxosByAddressesV2Globals } from "@avalanche-sdk/chainkit/models/operations";

let value: GetUtxosByAddressesV2Globals = {
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | A supported network type mainnet or testnet/fuji.                              | mainnet                                                                        |