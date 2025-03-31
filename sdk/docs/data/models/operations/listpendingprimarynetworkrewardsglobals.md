# ListPendingPrimaryNetworkRewardsGlobals

## Example Usage

```typescript
import { ListPendingPrimaryNetworkRewardsGlobals } from "@avalanche-sdk/sdk/data/models/operations";

let value: ListPendingPrimaryNetworkRewardsGlobals = {
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | A supported network type mainnet or testnet/fuji.                              | mainnet                                                                        |