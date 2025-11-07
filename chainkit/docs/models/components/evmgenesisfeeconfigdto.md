# EvmGenesisFeeConfigDto

## Example Usage

```typescript
import { EvmGenesisFeeConfigDto } from "@avalanche-sdk/chainkit/models/components";

let value: EvmGenesisFeeConfigDto = {
  baseFeeChangeDenominator: 36,
  blockGasCostStep: 200000,
  gasLimit: 12000000,
  maxBlockGasCost: 1000000,
  minBaseFee: 25000000000,
  minBlockGasCost: 0,
  targetBlockRate: 2,
  targetGas: 60000000,
};
```

## Fields

| Field                       | Type                        | Required                    | Description                 | Example                     |
| --------------------------- | --------------------------- | --------------------------- | --------------------------- | --------------------------- |
| `baseFeeChangeDenominator`  | *number*                    | :heavy_minus_sign:          | Base fee change denominator | 36                          |
| `blockGasCostStep`          | *number*                    | :heavy_minus_sign:          | Block gas cost step         | 200000                      |
| `gasLimit`                  | *number*                    | :heavy_minus_sign:          | Gas limit                   | 12000000                    |
| `maxBlockGasCost`           | *number*                    | :heavy_minus_sign:          | Maximum block gas cost      | 1000000                     |
| `minBaseFee`                | *number*                    | :heavy_minus_sign:          | Minimum base fee            | 25000000000                 |
| `minBlockGasCost`           | *number*                    | :heavy_minus_sign:          | Minimum block gas cost      | 0                           |
| `targetBlockRate`           | *number*                    | :heavy_minus_sign:          | Target block rate           | 2                           |
| `targetGas`                 | *number*                    | :heavy_minus_sign:          | Target gas                  | 60000000                    |