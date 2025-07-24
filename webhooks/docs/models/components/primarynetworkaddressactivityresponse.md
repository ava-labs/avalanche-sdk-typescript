# PrimaryNetworkAddressActivityResponse

## Example Usage

```typescript
import { PrimaryNetworkAddressActivityResponse } from "@avalanche-sdk/webhooks/models/components";

let value: PrimaryNetworkAddressActivityResponse = {
  id: "<id>",
  url: "https://general-babushka.biz/",
  chainId: "<id>",
  status: "inactive",
  createdAt: 6579.99,
  name: "<value>",
  description: "mmm tabulate especially under inside youthfully since word",
  eventType: "primary_network_address_activity",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "addresses",
    keys: [
      "<value 1>",
    ],
    subEvents: {
      addressActivitySubEvents: [],
    },
  },
};
```

## Fields

| Field                                                                                                                  | Type                                                                                                                   | Required                                                                                                               | Description                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `id`                                                                                                                   | *string*                                                                                                               | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `url`                                                                                                                  | *string*                                                                                                               | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `chainId`                                                                                                              | *string*                                                                                                               | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `status`                                                                                                               | [components.WebhookStatusType](../../models/components/webhookstatustype.md)                                           | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `createdAt`                                                                                                            | *number*                                                                                                               | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `name`                                                                                                                 | *string*                                                                                                               | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `description`                                                                                                          | *string*                                                                                                               | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `eventType`                                                                                                            | [components.PrimaryNetworkAddressActivityEventType](../../models/components/primarynetworkaddressactivityeventtype.md) | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |
| `metadata`                                                                                                             | [components.PrimaryNetworkAddressActivityMetadata](../../models/components/primarynetworkaddressactivitymetadata.md)   | :heavy_check_mark:                                                                                                     | N/A                                                                                                                    |