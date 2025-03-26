# ChainAddressChainIdMap

## Example Usage

```typescript
import { ChainAddressChainIdMap } from "@avalanche-sdk/sdk/data/models/components";

let value: ChainAddressChainIdMap = {
  address: "26994 Loyce Lock",
  blockchainIds: [
    "vV3cui1DsEPC3nLCGH9rorwo8s6BYxM2Hz4QFE5gEYjwTqAu",
  ],
};
```

## Fields

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `address`                                                              | *string*                                                               | :heavy_check_mark:                                                     | N/A                                                                    |
| `blockchainIds`                                                        | [components.BlockchainIds](../../models/components/blockchainids.md)[] | :heavy_check_mark:                                                     | N/A                                                                    |