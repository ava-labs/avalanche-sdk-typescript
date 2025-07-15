# ValidatorActivityResponse

## Example Usage

```typescript
import { ValidatorActivityResponse } from "@avalanche-sdk/webhooks/models/components";

let value: ValidatorActivityResponse = {
  id: "<id>",
  url: "https://juvenile-abacus.info/",
  chainId: "<id>",
  status: "inactive",
  createdAt: 5002.48,
  name: "<value>",
  description: "stiffen but behind flat supposing realistic",
  eventType: "validator_activity",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "subnetId",
    keys: [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    subEvents: {
      validatorActivitySubEvents: [],
    },
  },
};
```

## Fields

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `id`                                                                                           | *string*                                                                                       | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `url`                                                                                          | *string*                                                                                       | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `chainId`                                                                                      | *string*                                                                                       | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `status`                                                                                       | [components.WebhookStatusType](../../models/components/webhookstatustype.md)                   | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `createdAt`                                                                                    | *number*                                                                                       | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `name`                                                                                         | *string*                                                                                       | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `description`                                                                                  | *string*                                                                                       | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `eventType`                                                                                    | [components.ValidatorActivityEventType](../../models/components/validatoractivityeventtype.md) | :heavy_check_mark:                                                                             | N/A                                                                                            |
| `metadata`                                                                                     | [components.ValidatorActivityMetadata](../../models/components/validatoractivitymetadata.md)   | :heavy_check_mark:                                                                             | N/A                                                                                            |