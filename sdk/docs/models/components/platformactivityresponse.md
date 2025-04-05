# PlatformActivityResponse

## Example Usage

```typescript
import { PlatformActivityResponse } from "@avalanche-sdk/sdk/models/components";

let value: PlatformActivityResponse = {
  id: "<id>",
  eventType: "address_activity",
  url: "https://square-meatloaf.info",
  chainId: "<id>",
  status: "active",
  createdAt: 1034.49,
  name: "<value>",
  description: "unethically save physical nucleotidase finally",
  metadata: {
    keyType: "addresses",
    keys: [
      "<value>",
    ],
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
  },
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `id`                                                                         | *string*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |
| `eventType`                                                                  | [components.EventType](../../models/components/eventtype.md)                 | :heavy_check_mark:                                                           | N/A                                                                          |
| `url`                                                                        | *string*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |
| `chainId`                                                                    | *string*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |
| `status`                                                                     | [components.WebhookStatusType](../../models/components/webhookstatustype.md) | :heavy_check_mark:                                                           | N/A                                                                          |
| `createdAt`                                                                  | *number*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |
| `name`                                                                       | *string*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |
| `description`                                                                | *string*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |
| `metadata`                                                                   | *components.PlatformActivityResponseMetadata*                                | :heavy_check_mark:                                                           | N/A                                                                          |