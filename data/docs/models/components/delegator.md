# Delegator


## Supported Types

### `components.ActiveDelegatorDetails`

```typescript
const value: components.ActiveDelegatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  rewardAddresses: [
    "<value>",
  ],
  amountDelegated: "<value>",
  delegationFee: "<value>",
  startTimestamp: 9249.67,
  endTimestamp: 460.07,
  estimatedGrossReward: "<value>",
  estimatedNetReward: "<value>",
  delegationStatus: "active",
};
```

### `components.PendingDelegatorDetails`

```typescript
const value: components.PendingDelegatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  rewardAddresses: [
    "<value>",
  ],
  amountDelegated: "<value>",
  delegationFee: "<value>",
  startTimestamp: 2326.27,
  endTimestamp: 3485.19,
  estimatedGrossReward: "<value>",
  estimatedNetReward: "<value>",
  delegationStatus: "pending",
};
```

### `components.CompletedDelegatorDetails`

```typescript
const value: components.CompletedDelegatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  rewardAddresses: [
    "<value>",
  ],
  amountDelegated: "<value>",
  delegationFee: "<value>",
  startTimestamp: 8149.67,
  endTimestamp: 9854.92,
  grossReward: "<value>",
  netReward: "<value>",
  delegationStatus: "completed",
};
```

