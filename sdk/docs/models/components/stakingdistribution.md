# StakingDistribution

## Example Usage

```typescript
import { StakingDistribution } from "@avalanche-sdk/sdk/models/components";

let value: StakingDistribution = {
  version: "<value>",
  amountStaked: "<value>",
  validatorCount: 5735.99,
};
```

## Fields

| Field                                                     | Type                                                      | Required                                                  | Description                                               |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `version`                                                 | *string*                                                  | :heavy_check_mark:                                        | AvalancheGo version for the validator node.               |
| `amountStaked`                                            | *string*                                                  | :heavy_check_mark:                                        | The total amount staked by validators using this version. |
| `validatorCount`                                          | *number*                                                  | :heavy_check_mark:                                        | The number of validators using this version.              |