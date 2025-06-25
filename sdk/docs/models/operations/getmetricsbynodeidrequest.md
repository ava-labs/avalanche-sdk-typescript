# GetMetricsByNodeIdRequest

## Example Usage

```typescript
import { GetMetricsByNodeIdRequest } from "@avalanche-sdk/sdk/models/operations";

let value: GetMetricsByNodeIdRequest = {
  metric: "perNodeDailyFeesPaid",
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
  nodeId: "NodeID-JQPadXEMWtRtJyXrisyDNWuXKSjSf9D36",
};
```

## Fields

| Field                                                                                      | Type                                                                                       | Required                                                                                   | Description                                                                                | Example                                                                                    |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `metric`                                                                                   | [operations.GetMetricsByNodeIdMetric](../../models/operations/getmetricsbynodeidmetric.md) | :heavy_check_mark:                                                                         | Which metric to fetch for given L1 validator(node) ID.                                     | perNodeDailyFeesPaid                                                                       |
| `startTimestamp`                                                                           | *number*                                                                                   | :heavy_minus_sign:                                                                         | Query param for retrieving items after a specific timestamp.                               | 1689541049                                                                                 |
| `endTimestamp`                                                                             | *number*                                                                                   | :heavy_minus_sign:                                                                         | Query param for retrieving items before a specific timestamp.                              | 1689800249                                                                                 |
| `nodeId`                                                                                   | *string*                                                                                   | :heavy_check_mark:                                                                         | A primary network (P or X chain) nodeId.                                                   | NodeID-JQPadXEMWtRtJyXrisyDNWuXKSjSf9D36                                                   |