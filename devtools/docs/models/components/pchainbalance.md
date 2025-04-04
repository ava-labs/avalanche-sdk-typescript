# PChainBalance

## Example Usage

```typescript
import { PChainBalance } from "@avalanche-sdk/devtools/models/components";

let value: PChainBalance = {
  unlockedUnstaked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "nft",
      amount: "5001000",
      utxoCount: 1,
    },
  ],
  unlockedStaked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "nft",
      amount: "5001000",
      utxoCount: 1,
    },
  ],
  lockedPlatform: [
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
  lockedStakeable: [
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
  lockedStaked: [
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
  pendingStaked: [
    {
      assetId: "th5aLdWLi32yS9ED6uLGoMMubqHjzMsXhKWwzP6yZTYQKYzof",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
      type: "nft",
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
      type: "nft",
      amount: "5001000",
      utxoCount: 1,
      sharedWithChainId: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      status: "<value>",
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
      sharedWithChainId: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
      status: "<value>",
    },
  ],
};
```

## Fields

| Field                                                                                                                                                                                                                                 | Type                                                                                                                                                                                                                                  | Required                                                                                                                                                                                                                              | Description                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unlockedUnstaked`                                                                                                                                                                                                                    | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]                                                                                                                                                | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount,  and utxo count of that Asset ID.  Denotes the amount of unstaked Avax that is consumable by any transaction.                                                          |
| `unlockedStaked`                                                                                                                                                                                                                      | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]                                                                                                                                                | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount,  and utxo count of that Asset ID.  Denotes the amount of staked Avax that is consumable by any transaction when the staking period ends.                               |
| `lockedPlatform`                                                                                                                                                                                                                      | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]                                                                                                                                                | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount,  and utxo count of that Asset ID.  Denotes the amount of unstaked Avax that is locked at the platform level and not consumable by any transaction at the current time. |
| `lockedStakeable`                                                                                                                                                                                                                     | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]                                                                                                                                                | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount,  and utxo count of that Asset ID.  Denotes the amount of unstaked Avax that is locked at the platform level and only consumeable for staking transactions.             |
| `lockedStaked`                                                                                                                                                                                                                        | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]                                                                                                                                                | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount,  and utxo count of that Asset ID.  Denotes the amount of staked Avax that will be locked when the staking period ends.                                                 |
| `pendingStaked`                                                                                                                                                                                                                       | [components.AggregatedAssetAmount](../../models/components/aggregatedassetamount.md)[]                                                                                                                                                | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount,  and utxo count of that Asset ID.  Denotes the amount of staked Avax whose staking period has not yet started.                                                         |
| `atomicMemoryUnlocked`                                                                                                                                                                                                                | [components.PChainSharedAsset](../../models/components/pchainsharedasset.md)[]                                                                                                                                                        | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount and utxo count of that Asset ID. Denotes the amount of unlocked Avax in the atomic memory between P-Chain and other chain.                                              |
| `atomicMemoryLocked`                                                                                                                                                                                                                  | [components.PChainSharedAsset](../../models/components/pchainsharedasset.md)[]                                                                                                                                                        | :heavy_check_mark:                                                                                                                                                                                                                    | A list of objects containing P-chain Asset basic info, amount and utxo count of that Asset ID. Denotes the amount of locked Avax in the atomic memory between P-Chain and other chain.                                                |