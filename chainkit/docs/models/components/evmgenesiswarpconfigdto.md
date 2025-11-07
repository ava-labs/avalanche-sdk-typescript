# EvmGenesisWarpConfigDto

## Example Usage

```typescript
import { EvmGenesisWarpConfigDto } from "@avalanche-sdk/chainkit/models/components";

let value: EvmGenesisWarpConfigDto = {
  blockTimestamp: 1690000000,
  quorumNumerator: 67,
  requirePrimaryNetworkSigners: true,
};
```

## Fields

| Field                           | Type                            | Required                        | Description                     | Example                         |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| `blockTimestamp`                | *number*                        | :heavy_minus_sign:              | Block timestamp                 | 1690000000                      |
| `quorumNumerator`               | *number*                        | :heavy_minus_sign:              | Quorum numerator                | 67                              |
| `requirePrimaryNetworkSigners`  | *boolean*                       | :heavy_minus_sign:              | Require primary network signers | true                            |