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
  startTimestamp: 3321.63,
  endTimestamp: 1058.92,
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
  startTimestamp: 4264.52,
  endTimestamp: 5278.42,
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
  startTimestamp: 7425.37,
  endTimestamp: 6019.22,
  grossReward: "<value>",
  netReward: "<value>",
  delegationStatus: "completed",
};
```

