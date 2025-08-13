# PrimaryNetworkAddressActivityResponse

## Example Usage

```typescript
import { PrimaryNetworkAddressActivityResponse } from "@avalanche-sdk/chainkit/models/components";

let value: PrimaryNetworkAddressActivityResponse = {
  id: "<id>",
  url: "https://official-armoire.com",
  chainId: "<id>",
  status: "inactive",
  createdAt: 6715.74,
  name: "<value>",
  description: "yearly extremely feather whose er owlishly toward",
  eventType: "primary_network_address_activity",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "addresses",
    keys: [],
    subEvents: {
      addressActivitySubEvents: [
        "reward_distribution",
      ],
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