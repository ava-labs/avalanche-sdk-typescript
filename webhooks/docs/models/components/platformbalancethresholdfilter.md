# PlatformBalanceThresholdFilter

## Example Usage

```typescript
import { PlatformBalanceThresholdFilter } from "@avalanche-sdk/webhooks/models/components";

let value: PlatformBalanceThresholdFilter = {
  balanceType: "atomicMemoryLocked",
  balanceThreshold: "<value>",
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `balanceType`                                                                | [components.PChainBalanceType](../../models/components/pchainbalancetype.md) | :heavy_check_mark:                                                           | Type of balance to monitor                                                   |
| `balanceThreshold`                                                           | *string*                                                                     | :heavy_check_mark:                                                           | Threshold for balance corresponding to balanceType in nAVAX                  |