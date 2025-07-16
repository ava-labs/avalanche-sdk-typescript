# PrimaryNetworkBalanceThresholdFilter

## Example Usage

```typescript
import { PrimaryNetworkBalanceThresholdFilter } from "@avalanche-sdk/sdk/models/components";

let value: PrimaryNetworkBalanceThresholdFilter = {
  balanceType: "unlockedStaked",
  balanceThreshold: "<value>",
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `balanceType`                                                                | [components.CommonBalanceType](../../models/components/commonbalancetype.md) | :heavy_check_mark:                                                           | Type of balance to monitor                                                   |
| `balanceThreshold`                                                           | *string*                                                                     | :heavy_check_mark:                                                           | Threshold for balance corresponding to balanceType in nAVAX                  |