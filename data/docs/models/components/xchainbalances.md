# XChainBalances

## Example Usage

```typescript
import { XChainBalances } from "@avalanche-sdk/data/models/components";

let value: XChainBalances = {
  locked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "secp256k1",
      amount: "5001000",
      utxoCount: 1,
    },
  ],
  unlocked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "secp256k1",
      amount: "5001000",
      utxoCount: 1,
    },
  ],
  atomicMemoryUnlocked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "secp256k1",
      amount: "5001000",
      utxoCount: 1,
      sharedWithChainId: "<id>",
    },
  ],
  atomicMemoryLocked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "secp256k1",
      amount: "5001000",
      utxoCount: 1,
      sharedWithChainId: "<id>",
    },
  ],
};
```

## Fields

| Field                                                                                        | Type                                                                                         | Required                                                                                     | Description                                                                                  |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `locked`                                                                                     | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]       | :heavy_check_mark:                                                                           | A list of objects containing X-chain Asset balance information.                              |
| `unlocked`                                                                                   | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]       | :heavy_check_mark:                                                                           | A list of objects containing X-chain Asset balance information.                              |
| `atomicMemoryUnlocked`                                                                       | [components.XChainSharedAssetBalance](../../models/components/xchainsharedassetbalance.md)[] | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `atomicMemoryLocked`                                                                         | [components.XChainSharedAssetBalance](../../models/components/xchainsharedassetbalance.md)[] | :heavy_check_mark:                                                                           | N/A                                                                                          |