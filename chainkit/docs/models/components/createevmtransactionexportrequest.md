# CreateEvmTransactionExportRequest

## Example Usage

```typescript
import { CreateEvmTransactionExportRequest } from "@avalanche-sdk/chainkit/models/components";

let value: CreateEvmTransactionExportRequest = {
  type: "TRANSACTION_EXPORT_EVM",
  firstDate: "2023-05-01",
  lastDate: "2023-05-02",
  options: {
    addresses: [
      "<value 1>",
      "<value 2>",
      "<value 3>",
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
| `type`                                                                                                                  | *"TRANSACTION_EXPORT_EVM"*                                                                                              | :heavy_check_mark:                                                                                                      | N/A                                                                                                                     |                                                                                                                         |
| `firstDate`                                                                                                             | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | N/A                                                                                                                     | 2023-05-01                                                                                                              |
| `lastDate`                                                                                                              | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | N/A                                                                                                                     | 2023-05-02                                                                                                              |
| ~~`startDate`~~                                                                                                         | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | : warning: ** DEPRECATED **: This will be removed in a future release, please migrate away from it as soon as possible. | 2023-05-01                                                                                                              |
| ~~`endDate`~~                                                                                                           | *string*                                                                                                                | :heavy_minus_sign:                                                                                                      | : warning: ** DEPRECATED **: This will be removed in a future release, please migrate away from it as soon as possible. | 2023-05-02                                                                                                              |
| `options`                                                                                                               | [components.EvmNetworkOptions](../../models/components/evmnetworkoptions.md)                                            | :heavy_check_mark:                                                                                                      | N/A                                                                                                                     |                                                                                                                         |