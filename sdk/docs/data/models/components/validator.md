# Validator


## Supported Types

### `components.ActiveValidatorDetails`

```typescript
const value: components.ActiveValidatorDetails = {
  txHash: "<value>",
  nodeId: "<id>",
  subnetId: "<id>",
  amountStaked: "<value>",
  startTimestamp: 3485.19,
  endTimestamp: 8149.67,
  stakePercentage: 9854.92,
  delegatorCount: 9689.72,
  uptimePerformance: 9049.49,
  potentialRewards: {
    validationRewardAmount: "<value>",
    delegationRewardAmount: "<value>",
  },
  validationStatus: "active",
  validatorHealth: {
    reachabilityPercent: 2965.56,
    benchedPChainRequestsPercent: 9920.12,
    benchedXChainRequestsPercent: 2494.2,
    benchedCChainRequestsPercent: 1059.06,
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
  startTimestamp: 9509.53,
  endTimestamp: 2334.2,
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
  startTimestamp: 6897.68,
  endTimestamp: 583.56,
  delegatorCount: 7307.09,
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
  startTimestamp: 8817.21,
  endTimestamp: 2724.37,
  removeTxHash: "<value>",
  removeTimestamp: 3790.57,
  validationStatus: "removed",
};
```

