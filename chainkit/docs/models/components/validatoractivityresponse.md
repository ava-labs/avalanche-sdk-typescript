# ValidatorActivityResponse

## Example Usage

```typescript
import { ValidatorActivityResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ValidatorActivityResponse = {
  id: "<id>",
  url: "https://negative-apricot.info/",
  chainId: "<id>",
  status: "inactive",
  createdAt: 3981.87,
  name: "<value>",
  description: "propound astride guard where yowza",
  eventType: "validator_activity",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "subnetId",
    keys: [],
    subEvents: {
      validatorActivitySubEvents: [],
    },
  },
};
```

## Fields

| Field                                                                                        | Type                                                                                         | Required                                                                                     | Description                                                                                  |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `id`                                                                                         | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `url`                                                                                        | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `chainId`                                                                                    | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `status`                                                                                     | [components.WebhookStatusType](../../models/components/webhookstatustype.md)                 | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `createdAt`                                                                                  | *number*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `name`                                                                                       | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `description`                                                                                | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `eventType`                                                                                  | *"validator_activity"*                                                                       | :heavy_check_mark:                                                                           | N/A                                                                                          |
| `metadata`                                                                                   | [components.ValidatorActivityMetadata](../../models/components/validatoractivitymetadata.md) | :heavy_check_mark:                                                                           | N/A                                                                                          |