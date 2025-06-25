# ListXChainBalancesResponse

## Example Usage

```typescript
import { ListXChainBalancesResponse } from "@avalanche-sdk/data/models/components";

let value: ListXChainBalancesResponse = {
  balances: {
    locked: [],
    unlocked: [],
    atomicMemoryUnlocked: [],
    atomicMemoryLocked: [],
  },
  chainInfo: {
    chainName: "c-chain",
    network: "mainnet",
  },
};
```

## Fields

| Field                                                                                    | Type                                                                                     | Required                                                                                 | Description                                                                              |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `balances`                                                                               | [components.XChainBalances](../../models/components/xchainbalances.md)                   | :heavy_check_mark:                                                                       | N/A                                                                                      |
| `chainInfo`                                                                              | [components.PrimaryNetworkChainInfo](../../models/components/primarynetworkchaininfo.md) | :heavy_check_mark:                                                                       | N/A                                                                                      |