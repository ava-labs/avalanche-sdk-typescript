# Validator


## Supported Types

### `components.ActiveValidatorDetails`

```typescript
const value: components.ActiveValidatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  subnetId: "<id>",
  amountStaked: "<value>",
  startTimestamp: 4240.32,
  endTimestamp: 2586.84,
  stakePercentage: 8490.39,
  delegatorCount: 333.04,
  uptimePerformance: 9589.83,
  potentialRewards: {
    validationRewardAmount: "<value>",
    delegationRewardAmount: "<value>",
  },
  validationStatus: "active",
  validatorHealth: {
    reachabilityPercent: 3553.69,
    benchedPChainRequestsPercent: 3567.07,
    benchedXChainRequestsPercent: 163.28,
    benchedCChainRequestsPercent: 1852.32,
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
  startTimestamp: 4012.59,
  endTimestamp: 9292.92,
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
  startTimestamp: 996.15,
  endTimestamp: 9453.02,
  delegatorCount: 8694.89,
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
  startTimestamp: 4541.62,
  endTimestamp: 3267.01,
  removeTxHash: "<value>",
  removeTimestamp: 2327.44,
  validationStatus: "removed",
};
```

