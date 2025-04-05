# ListChainsRequest

## Example Usage

```typescript
import { ListChainsRequest } from "@avalanche-sdk/sdk/models/operations";

let value: ListChainsRequest = {
  network: "mainnet",
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     | Example                                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `pageToken`                                                                                     | *string*                                                                                        | :heavy_minus_sign:                                                                              | A page token, received from a previous list call. Provide this to retrieve the subsequent page. |                                                                                                 |
| `network`                                                                                       | [components.Network](../../models/components/network.md)                                        | :heavy_minus_sign:                                                                              | Either mainnet or testnet/fuji.                                                                 | mainnet                                                                                         |