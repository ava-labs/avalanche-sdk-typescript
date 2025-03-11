# SupportedChainsRequest

## Example Usage

```typescript
import { SupportedChainsRequest } from "@avalanche-sdk/data/models/operations";

let value: SupportedChainsRequest = {
  network: "mainnet",
  feature: "nftIndexing",
};
```

## Fields

| Field                                                          | Type                                                           | Required                                                       | Description                                                    | Example                                                        |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `network`                                                      | [components.Network](../../models/components/network.md)       | :heavy_minus_sign:                                             | Either mainnet or testnet/fuji.                                | mainnet                                                        |
| `feature`                                                      | [components.ApiFeature](../../models/components/apifeature.md) | :heavy_minus_sign:                                             | Filter by feature.                                             | nftIndexing                                                    |