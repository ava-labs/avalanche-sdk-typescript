# CreateEvmTransactionExportRequest

## Example Usage

```typescript
import { CreateEvmTransactionExportRequest } from "@avalanche-sdk/sdk/models/components";

let value: CreateEvmTransactionExportRequest = {
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

## Fields

| Field                                                                                                                   | Type                                                                                                                    | Required                                                                                                                | Description                                                                                                             | Example                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `type`                                                                                                                  | [components.EVMOperationType](../../models/components/evmoperationtype.md)                                              | :heavy_check_mark:                                                                                                      | N/A                                                                                                                     |                                                                                                                         |
| `firstDate`                                                                                                             | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | N/A                                                                                                                     | 2023-05-01                                                                                                              |
| `lastDate`                                                                                                              | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | N/A                                                                                                                     | 2023-05-02                                                                                                              |
| ~~`startDate`~~                                                                                                         | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | : warning: ** DEPRECATED **: This will be removed in a future release, please migrate away from it as soon as possible. | 2023-05-01                                                                                                              |
| ~~`endDate`~~                                                                                                           | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | : warning: ** DEPRECATED **: This will be removed in a future release, please migrate away from it as soon as possible. | 2023-05-02                                                                                                              |
| `options`                                                                                                               | [components.EvmNetworkOptions](../../models/components/evmnetworkoptions.md)                                            | :heavy_check_mark:                                                                                                      | N/A                                                                                                                     |                                                                                                                         |