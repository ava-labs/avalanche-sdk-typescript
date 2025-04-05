# ListLatestPrimaryNetworkTransactionsGlobals

## Example Usage

```typescript
import { ListLatestPrimaryNetworkTransactionsGlobals } from "@avalanche-sdk/sdk/models/operations";

let value: ListLatestPrimaryNetworkTransactionsGlobals = {
  network: "mainnet",
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `network`                                                                      | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md) | :heavy_minus_sign:                                                             | A supported network type mainnet or testnet/fuji.                              | mainnet                                                                        |