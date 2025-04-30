# InternalTransactionDetails

## Example Usage

```typescript
import { InternalTransactionDetails } from "@avalanche-sdk/data/models/components";

let value: InternalTransactionDetails = {
  from: {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    decimals: 18,
    logoUri:
      "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  to: {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    decimals: 18,
    logoUri:
      "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  internalTxType: "CREATE3",
  value: "10000000000000000000",
  isReverted: false,
  gasUsed: "<value>",
  gasLimit: "<value>",
};
```

## Fields

| Field                                                                                        | Type                                                                                         | Required                                                                                     | Description                                                                                  | Example                                                                                      |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `from`                                                                                       | [components.RichAddress](../../models/components/richaddress.md)                             | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `to`                                                                                         | [components.RichAddress](../../models/components/richaddress.md)                             | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `internalTxType`                                                                             | [components.InternalTransactionOpCall](../../models/components/internaltransactionopcall.md) | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `value`                                                                                      | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          | 10000000000000000000                                                                         |
| `isReverted`                                                                                 | *boolean*                                                                                    | :heavy_check_mark:                                                                           | True if the internal transaction was reverted.                                               |                                                                                              |
| `gasUsed`                                                                                    | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `gasLimit`                                                                                   | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |