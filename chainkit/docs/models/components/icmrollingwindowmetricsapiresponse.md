# ICMRollingWindowMetricsApiResponse

## Example Usage

```typescript
import { ICMRollingWindowMetricsApiResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ICMRollingWindowMetricsApiResponse = {
  result: {
    srcBlockchainId: "<id>",
    destBlockchainId: "<id>",
  },
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `result`                                                                                           | [components.ICMRollingWindowMetricsValue](../../models/components/icmrollingwindowmetricsvalue.md) | :heavy_check_mark:                                                                                 | Array of current metrics values for different windows.                                             |