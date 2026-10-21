# Avalanche L1 Chains

The `Chains` module provides a collection of Avalanche Layer 1 (L1) chain configurations in a standardized format. These configurations are useful for interacting with Avalanche networks in a consistent and type-safe way, and is compatible with libraries like [viem](https://viem.sh/).

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0.0

## Installation

```bash
npm install @avalanche-sdk/chains
```

## Usage

Using any of the listed L1s from the `chains` module is very simple:

```typescript
import { avalancheFuji, dispatch } from "@avalanche-sdk/chains";

console.log(avalancheFuji.id);
```

## ChainConfig

The `ChainConfig` interface extends `viem`'s [official config](https://viem.sh/docs/chains/introduction) by enforcing the following Teleporter related properties.

This config is used in other Avalanche SDKs like `interchain` and `client`.

```typescript
export interface ChainConfig extends Chain {
  blockchainId: string;
  contracts: {
    [key: string]: {
      address: Address;
    };
    teleporterRegistry: {
      address: Address;
    };
    teleporterManager: {
      address: Address;
    };
  }
}
```

## Extending ChainConfig

If you want to test chains locally which are not in this module, you can easily define the chain config like this (see Viem's [Custom Chains](https://viem.sh/docs/chains/introduction#custom-chains)):

```typescript
import { defineChain } from 'viem'
 
export const zora = defineChain({
  id: 7777777,
  name: 'Zora',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.zora.energy'],
      webSocket: ['wss://rpc.zora.energy'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.zora.energy' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5882,
    },
    teleporterRegistry: {
      address: '0xF86Cb19Ad8405AEFa7d09C778215D2Cb6eBfB228',
    },
    teleporterManager: {
      address: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
    },
  },
  blockchainId: 'abc';
})
```

## Contributing

You can expand the official `Chains` module by adding the chain config following the above interface.
