# HealthCheckResultDto

## Example Usage

```typescript
import { HealthCheckResultDto } from "@avalanche-sdk/webhooks/models/components";

let value: HealthCheckResultDto = {
  info: {
    "database": {
      status: "up",
    },
  },
  error: {},
  details: {
    "database": {
      status: "up",
    },
  },
};
```

## Fields

| Field                                                                                                      | Type                                                                                                       | Required                                                                                                   | Description                                                                                                | Example                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `status`                                                                                                   | [components.HealthCheckResultDtoStatus](../../models/components/healthcheckresultdtostatus.md)             | :heavy_minus_sign:                                                                                         | N/A                                                                                                        |                                                                                                            |
| `info`                                                                                                     | Record<string, [components.HealthIndicatorResultDto](../../models/components/healthindicatorresultdto.md)> | :heavy_minus_sign:                                                                                         | N/A                                                                                                        | {<br/>"database": {<br/>"status": "up"<br/>}<br/>}                                                         |
| `error`                                                                                                    | Record<string, [components.HealthIndicatorResultDto](../../models/components/healthindicatorresultdto.md)> | :heavy_minus_sign:                                                                                         | N/A                                                                                                        | {}                                                                                                         |
| `details`                                                                                                  | Record<string, [components.HealthIndicatorResultDto](../../models/components/healthindicatorresultdto.md)> | :heavy_minus_sign:                                                                                         | N/A                                                                                                        | {<br/>"database": {<br/>"status": "up"<br/>}<br/>}                                                         |