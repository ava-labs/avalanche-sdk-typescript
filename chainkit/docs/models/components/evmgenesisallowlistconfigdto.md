# EvmGenesisAllowListConfigDto

## Example Usage

```typescript
import { EvmGenesisAllowListConfigDto } from "@avalanche-sdk/chainkit/models/components";

let value: EvmGenesisAllowListConfigDto = {
  blockTimestamp: 0,
  adminAddresses: [
    "0x1234...",
  ],
  managerAddresses: [
    "0x5678...",
  ],
  enabledAddresses: [
    "0x9abc...",
  ],
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `blockTimestamp`   | *number*           | :heavy_minus_sign: | Block timestamp    | 0                  |
| `adminAddresses`   | *string*[]         | :heavy_minus_sign: | Admin addresses    | [<br/>"0x1234..."<br/>] |
| `managerAddresses` | *string*[]         | :heavy_minus_sign: | Manager addresses  | [<br/>"0x5678..."<br/>] |
| `enabledAddresses` | *string*[]         | :heavy_minus_sign: | Enabled addresses  | [<br/>"0x9abc..."<br/>] |