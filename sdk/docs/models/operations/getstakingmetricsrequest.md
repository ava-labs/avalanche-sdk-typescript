# GetStakingMetricsRequest

## Example Usage

```typescript
import { GetStakingMetricsRequest } from "@avalanche-sdk/sdk/models/operations";

let value: GetStakingMetricsRequest = {
  metric: "validatorCount",
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
  network: "mainnet",
};
```

## Fields

| Field                                                                                            | Type                                                                                             | Required                                                                                         | Description                                                                                      | Example                                                                                          |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `metric`                                                                                         | [components.NetworkMetric](../../models/components/networkmetric.md)                             | :heavy_check_mark:                                                                               | Which network level metric to fetch.                                                             | validatorCount                                                                                   |
| `startTimestamp`                                                                                 | *number*                                                                                         | :heavy_minus_sign:                                                                               | Query param for retrieving items after a specific timestamp.                                     | 1689541049                                                                                       |
| `endTimestamp`                                                                                   | *number*                                                                                         | :heavy_minus_sign:                                                                               | Query param for retrieving items before a specific timestamp.                                    | 1689800249                                                                                       |
| `pageToken`                                                                                      | *string*                                                                                         | :heavy_minus_sign:                                                                               | A page token, received from a previous list call. Provide this to retrieve the subsequent page.  |                                                                                                  |
| `pageSize`                                                                                       | *number*                                                                                         | :heavy_minus_sign:                                                                               | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 2160. | 10                                                                                               |
| `network`                                                                                        | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md)                   | :heavy_minus_sign:                                                                               | Either mainnet or testnet/fuji.                                                                  | mainnet                                                                                          |
| `subnetId`                                                                                       | *any*                                                                                            | :heavy_minus_sign:                                                                               | The subnet ID to filter by. If not provided, then all subnets will be returned.                  | 11111111111111111111111111111111LpoYY                                                            |