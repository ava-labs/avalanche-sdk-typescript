# RollingWindowMetricsApiResponse

## Example Usage

```typescript
import { RollingWindowMetricsApiResponse } from "@avalanche-sdk/sdk/metrics/models/components";

let value: RollingWindowMetricsApiResponse = {
  result: {
    lastHour: 5288.95,
    lastDay: 5680.45,
    lastMonth: 9255.97,
    lastYear: 710.36,
    allTime: 871.29,
  },
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `result`                                                                                               | [components.ChainRollingWindowMetricsValue](../../models/components/chainrollingwindowmetricsvalue.md) | :heavy_check_mark:                                                                                     | Array of current metrics values for different windows.                                                 |