# ValidatorHealthDetails

## Example Usage

```typescript
import { ValidatorHealthDetails } from "@avalanche-sdk/data/models/components";

let value: ValidatorHealthDetails = {
  reachabilityPercent: 9679.66,
  benchedPChainRequestsPercent: 9944.01,
  benchedXChainRequestsPercent: 4518.22,
  benchedCChainRequestsPercent: 708.69,
};
```

## Fields

| Field                                                          | Type                                                           | Required                                                       | Description                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `reachabilityPercent`                                          | *number*                                                       | :heavy_check_mark:                                             | Percent of requests responded to in last polling.              |
| `benchedPChainRequestsPercent`                                 | *number*                                                       | :heavy_check_mark:                                             | Percent of requests benched on the P-Chain in last polling.    |
| `benchedXChainRequestsPercent`                                 | *number*                                                       | :heavy_check_mark:                                             | Percentage of requests benched on the X-Chain in last polling. |
| `benchedCChainRequestsPercent`                                 | *number*                                                       | :heavy_check_mark:                                             | Percentage of requests benched on the C-Chain in last polling. |