# PostTransactionExportJobRequest


## Supported Types

### `components.CreateEvmTransactionExportRequest`

```typescript
const value: components.CreateEvmTransactionExportRequest = {
  type: "TRANSACTION_EXPORT_EVM",
  firstDate: "2023-05-01",
  lastDate: "2023-05-02",
  options: {
    addresses: [
      "<value>",
    ],
    includeChains: [
      "43114",
    ],
  },
};
```

### `components.CreatePrimaryNetworkTransactionExportRequest`

```typescript
const value: components.CreatePrimaryNetworkTransactionExportRequest = {
  type: "TRANSACTION_EXPORT_PRIMARY_NETWORK_STAKING",
  firstDate: "2023-05-01",
  lastDate: "2023-05-02",
  options: {
    includeChains: [
      "p-chain",
    ],
  },
};
```

