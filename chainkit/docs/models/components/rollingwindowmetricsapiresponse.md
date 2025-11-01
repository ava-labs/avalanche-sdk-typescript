# RollingWindowMetricsApiResponse

## Example Usage

```typescript
import { RollingWindowMetricsApiResponse } from "@avalanche-sdk/chainkit/models/components";

let value: RollingWindowMetricsApiResponse = {
  result: {},
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `result`                                                                                               | [components.ChainRollingWindowMetricsValue](../../models/components/chainrollingwindowmetricsvalue.md) | :heavy_check_mark:                                                                                     | Array of current metrics values for different windows.                                                 |