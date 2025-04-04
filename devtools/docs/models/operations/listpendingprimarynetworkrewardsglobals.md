# ListPendingPrimaryNetworkRewardsGlobals

## Example Usage

```typescript
import { ListPendingPrimaryNetworkRewardsGlobals } from "@avalanche-sdk/devtools/models/operations";

let value: ListPendingPrimaryNetworkRewardsGlobals = {
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | A supported network type mainnet or testnet/fuji.                              | mainnet                                                                        |