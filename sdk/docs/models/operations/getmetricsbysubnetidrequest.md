# GetMetricsBySubnetIdRequest

## Example Usage

```typescript
import { GetMetricsBySubnetIdRequest } from "@avalanche-sdk/sdk/models/operations";

let value: GetMetricsBySubnetIdRequest = {
  metric: "perSubnetDailyFeesPaid",
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
  subnetId: "eYwmVU67LmSfZb1RwqCMhBYkFyG8ftxn6jAwqzFmxC9STBWLC",
};
```

## Fields

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    | Example                                                                                        |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `metric`                                                                                       | [operations.GetMetricsBySubnetIdMetric](../../models/operations/getmetricsbysubnetidmetric.md) | :heavy_check_mark:                                                                             | Which metric to fetch for given subnet ID.                                                     | perSubnetDailyFeesPaid                                                                         |
| `startTimestamp`                                                                               | *number*                                                                                       | :heavy_minus_sign:                                                                             | Query param for retrieving items after a specific timestamp.                                   | 1689541049                                                                                     |
| `endTimestamp`                                                                                 | *number*                                                                                       | :heavy_minus_sign:                                                                             | Query param for retrieving items before a specific timestamp.                                  | 1689800249                                                                                     |
| `subnetId`                                                                                     | *string*                                                                                       | :heavy_check_mark:                                                                             | The subnet ID to filter by.                                                                    | eYwmVU67LmSfZb1RwqCMhBYkFyG8ftxn6jAwqzFmxC9STBWLC                                              |