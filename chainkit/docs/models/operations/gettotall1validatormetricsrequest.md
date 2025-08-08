# GetTotalL1ValidatorMetricsRequest

## Example Usage

```typescript
import { GetTotalL1ValidatorMetricsRequest } from "@avalanche-sdk/chainkit/models/operations";

let value: GetTotalL1ValidatorMetricsRequest = {
  metric: "totalValidatorFeesDaily",
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
};
```

## Fields

| Field                                                                                                      | Type                                                                                                       | Required                                                                                                   | Description                                                                                                | Example                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `metric`                                                                                                   | [operations.GetTotalL1ValidatorMetricsMetric](../../models/operations/gettotall1validatormetricsmetric.md) | :heavy_check_mark:                                                                                         | Which network level metric to fetch for L1 validator.                                                      | totalValidatorFeesDaily                                                                                    |
| `startTimestamp`                                                                                           | *number*                                                                                                   | :heavy_minus_sign:                                                                                         | Query param for retrieving items after a specific timestamp.                                               | 1689541049                                                                                                 |
| `endTimestamp`                                                                                             | *number*                                                                                                   | :heavy_minus_sign:                                                                                         | Query param for retrieving items before a specific timestamp.                                              | 1689800249                                                                                                 |