# CChainAtomicBalances

## Example Usage

```typescript
import { CChainAtomicBalances } from "@avalanche-sdk/data/models/components";

let value: CChainAtomicBalances = {
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
      type: "nft",
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
| `atomicMemoryUnlocked`                                                                       | [components.CChainSharedAssetBalance](../../models/components/cchainsharedassetbalance.md)[] | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `atomicMemoryLocked`                                                                         | [components.CChainSharedAssetBalance](../../models/components/cchainsharedassetbalance.md)[] | :heavy_check_mark:                                                                           | N/A                                                                                          |