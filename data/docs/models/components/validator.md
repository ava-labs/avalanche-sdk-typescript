# Validator


## Supported Types

### `components.ActiveValidatorDetails`

```typescript
const value: components.ActiveValidatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  subnetId: "<id>",
  amountStaked: "<value>",
  startTimestamp: 8490.39,
  endTimestamp: 333.04,
  stakePercentage: 9589.83,
  delegatorCount: 3553.69,
  uptimePerformance: 3567.07,
  potentialRewards: {
    validationRewardAmount: "<value>",
    delegationRewardAmount: "<value>",
  },
  validationStatus: "active",
  validatorHealth: {
    reachabilityPercent: 163.28,
    benchedPChainRequestsPercent: 1852.32,
    benchedXChainRequestsPercent: 4012.59,
    benchedCChainRequestsPercent: 9292.92,
  },
};
```

### `components.PendingValidatorDetails`

```typescript
const value: components.PendingValidatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  subnetId: "<id>",
  amountStaked: "<value>",
  startTimestamp: 996.15,
  endTimestamp: 9453.02,
  validationStatus: "pending",
};
```

### `components.CompletedValidatorDetails`

```typescript
const value: components.CompletedValidatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  subnetId: "<id>",
  amountStaked: "<value>",
  startTimestamp: 8694.89,
  endTimestamp: 4541.62,
  delegatorCount: 3267.01,
  rewards: {
    validationRewardAmount: "<value>",
    delegationRewardAmount: "<value>",
  },
  validationStatus: "completed",
};
```

### `components.RemovedValidatorDetails`

```typescript
const value: components.RemovedValidatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  subnetId: "<id>",
  amountStaked: "<value>",
  startTimestamp: 2327.44,
  endTimestamp: 6144.65,
  removeTxHash: "<value>",
  removeTimestamp: 330.74,
  validationStatus: "removed",
};
```

