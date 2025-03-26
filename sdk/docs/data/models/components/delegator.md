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
  startTimestamp: 8953.86,
  endTimestamp: 9677.95,
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
  startTimestamp: 5468.85,
  endTimestamp: 2748.23,
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
  startTimestamp: 5922.31,
  endTimestamp: 8967.62,
  grossReward: "<value>",
  netReward: "<value>",
  delegationStatus: "completed",
};
```

