# EvmGenesisAllocDto

## Example Usage

```typescript
import { EvmGenesisAllocDto } from "@avalanche-sdk/chainkit/models/components";

let value: EvmGenesisAllocDto = {
  balance: "0x295BE96E64066972000000",
  code: "0x6080604052...",
};
```

## Fields

| Field                           | Type                            | Required                        | Description                     | Example                         |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| `balance`                       | *string*                        | :heavy_minus_sign:              | Account balance in hex format   | 0x295BE96E64066972000000        |
| `code`                          | *string*                        | :heavy_minus_sign:              | Contract bytecode in hex format | 0x6080604052...                 |
| `storage`                       | Record<string, *string*>        | :heavy_minus_sign:              | Contract storage slots          |                                 |