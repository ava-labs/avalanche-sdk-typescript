# RollingWindowMetricsApiResponse

## Example Usage

```typescript
import { RollingWindowMetricsApiResponse } from "@avalanche-sdk/sdk/models/components";

let value: RollingWindowMetricsApiResponse = {
  result: {
    lastHour: 3141.43,
    lastDay: 8857.92,
    lastMonth: 2439.17,
    lastYear: 712.28,
    allTime: 3194.78,
  },
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `result`                                                                                               | [components.ChainRollingWindowMetricsValue](../../models/components/chainrollingwindowmetricsvalue.md) | :heavy_check_mark:                                                                                     | Array of current metrics values for different windows.                                                 |