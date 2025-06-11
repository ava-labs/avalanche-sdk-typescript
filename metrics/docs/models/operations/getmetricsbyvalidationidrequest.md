# GetMetricsByValidationIdRequest

## Example Usage

```typescript
import { GetMetricsByValidationIdRequest } from "@avalanche-sdk/metrics/models/operations";

let value: GetMetricsByValidationIdRequest = {
  l1ValidationId: "2YYCZGHjqnbw1MzQ5fGrTp3SjqUu8y1J1xeW4yuhdXe4LoUVVG",
  metric: "validationFeesDaily",
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            | Example                                                                                                |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `l1ValidationId`                                                                                       | *string*                                                                                               | :heavy_check_mark:                                                                                     | The L1 Validator's validation ID to filter by                                                          | 2YYCZGHjqnbw1MzQ5fGrTp3SjqUu8y1J1xeW4yuhdXe4LoUVVG                                                     |
| `metric`                                                                                               | [operations.GetMetricsByValidationIdMetric](../../models/operations/getmetricsbyvalidationidmetric.md) | :heavy_check_mark:                                                                                     | Which metric to fetch for given L1 validation ID.                                                      | validationFeesDaily                                                                                    |
| `startTimestamp`                                                                                       | *number*                                                                                               | :heavy_minus_sign:                                                                                     | Query param for retrieving items after a specific timestamp.                                           | 1689541049                                                                                             |
| `endTimestamp`                                                                                         | *number*                                                                                               | :heavy_minus_sign:                                                                                     | Query param for retrieving items before a specific timestamp.                                          | 1689800249                                                                                             |