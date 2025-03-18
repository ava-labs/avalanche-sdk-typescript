# ValidatorHealthDetails

## Example Usage

```typescript
import { ValidatorHealthDetails } from "@avalanche-sdk/data/models/components";

let value: ValidatorHealthDetails = {
  reachabilityPercent: 6387.62,
  benchedPChainRequestsPercent: 4903.05,
  benchedXChainRequestsPercent: 9894.1,
  benchedCChainRequestsPercent: 653.04,
};
```

## Fields

| Field                                                          | Type                                                           | Required                                                       | Description                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `reachabilityPercent`                                          | *number*                                                       | :heavy_check_mark:                                             | Percent of requests responded to in last polling.              |
| `benchedPChainRequestsPercent`                                 | *number*                                                       | :heavy_check_mark:                                             | Percent of requests benched on the P-Chain in last polling.    |
| `benchedXChainRequestsPercent`                                 | *number*                                                       | :heavy_check_mark:                                             | Percentage of requests benched on the X-Chain in last polling. |
| `benchedCChainRequestsPercent`                                 | *number*                                                       | :heavy_check_mark:                                             | Percentage of requests benched on the C-Chain in last polling. |