# GetValidatorsByDateRangeRequest

## Example Usage

```typescript
import { GetValidatorsByDateRangeRequest } from "@avalanche-sdk/sdk/models/operations";

let value: GetValidatorsByDateRangeRequest = {
  startTimestamp: 1689541049,
  endTimestamp: 1689800249,
  subnetId: "11111111111111111111111111111111LpoYY",
  network: "mainnet",
};
```

## Fields

| Field                                                                                            | Type                                                                                             | Required                                                                                         | Description                                                                                      | Example                                                                                          |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `startTimestamp`                                                                                 | *number*                                                                                         | :heavy_minus_sign:                                                                               | Query param for retrieving items after a specific timestamp.                                     | 1689541049                                                                                       |
| `endTimestamp`                                                                                   | *number*                                                                                         | :heavy_minus_sign:                                                                               | Query param for retrieving items before a specific timestamp.                                    | 1689800249                                                                                       |
| `pageToken`                                                                                      | *string*                                                                                         | :heavy_minus_sign:                                                                               | A page token, received from a previous list call. Provide this to retrieve the subsequent page.  |                                                                                                  |
| `pageSize`                                                                                       | *number*                                                                                         | :heavy_minus_sign:                                                                               | The maximum number of items to return. The minimum page size is 1. The maximum pageSize is 5000. | 10                                                                                               |
| `subnetId`                                                                                       | *string*                                                                                         | :heavy_check_mark:                                                                               | The subnet ID to filter by. If not provided, then all subnets will be returned.                  | 11111111111111111111111111111111LpoYY                                                            |
| `network`                                                                                        | [components.Network](../../models/components/network.md)                                         | :heavy_minus_sign:                                                                               | Either mainnet or testnet/fuji.                                                                  | mainnet                                                                                          |