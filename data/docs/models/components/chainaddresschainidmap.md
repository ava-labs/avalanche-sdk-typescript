# ChainAddressChainIdMap

## Example Usage

```typescript
import { ChainAddressChainIdMap } from "@avalanche-sdk/data/models/components";

let value: ChainAddressChainIdMap = {
  address: "52144 Wendy Hills",
  blockchainIds: [
    "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5",
  ],
};
```

## Fields

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `address`                                                              | *string*                                                               | :heavy_check_mark:                                                     | N/A                                                                    |
| `blockchainIds`                                                        | [components.BlockchainIds](../../models/components/blockchainids.md)[] | :heavy_check_mark:                                                     | N/A                                                                    |