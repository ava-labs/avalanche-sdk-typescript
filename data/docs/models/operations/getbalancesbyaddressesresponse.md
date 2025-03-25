# GetBalancesByAddressesResponse

Successful response


## Supported Types

### `components.ListPChainBalancesResponse`

```typescript
const value: components.ListPChainBalancesResponse = {
  balances: {
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
        type: "nft",
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
        type: "nft",
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
  },
  chainInfo: {
    chainName: "x-chain",
    network: "mainnet",
  },
};
```

### `components.ListXChainBalancesResponse`

```typescript
const value: components.ListXChainBalancesResponse = {
  balances: {
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
  },
  chainInfo: {
    chainName: "x-chain",
    network: "mainnet",
  },
};
```

### `components.ListCChainAtomicBalancesResponse`

```typescript
const value: components.ListCChainAtomicBalancesResponse = {
  balances: {
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
  },
  chainInfo: {
    chainName: "c-chain",
    network: "mainnet",
  },
};
```

