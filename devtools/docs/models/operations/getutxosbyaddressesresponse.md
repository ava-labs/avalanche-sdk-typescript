# GetUtxosByAddressesResponse

## Example Usage

```typescript
import { GetUtxosByAddressesResponse } from "@avalanche-sdk/devtools/models/operations";

let value: GetUtxosByAddressesResponse = {
  result: {
    utxos: [],
    chainInfo: {
      chainName: "c-chain",
      network: "mainnet",
    },
  },
};
```

## Fields

| Field                                        | Type                                         | Required                                     | Description                                  |
| -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| `result`                                     | *operations.GetUtxosByAddressesResponseBody* | :heavy_check_mark:                           | N/A                                          |