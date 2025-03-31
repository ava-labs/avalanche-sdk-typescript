# ListPrimaryNetworkBlocksByNodeIdGlobals

## Example Usage

```typescript
import { ListPrimaryNetworkBlocksByNodeIdGlobals } from "@avalanche-sdk/sdk/data/models/operations";

let value: ListPrimaryNetworkBlocksByNodeIdGlobals = {
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | A supported network type mainnet or testnet/fuji.                              | mainnet                                                                        |