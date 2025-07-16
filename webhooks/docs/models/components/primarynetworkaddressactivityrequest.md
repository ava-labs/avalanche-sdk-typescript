# PrimaryNetworkAddressActivityRequest

## Example Usage

```typescript
import { PrimaryNetworkAddressActivityRequest } from "@avalanche-sdk/webhooks/models/components";

let value: PrimaryNetworkAddressActivityRequest = {
  eventType: "primary_network_address_activity",
  url: "https://irresponsible-entry.name",
  network: "mainnet",
  chainId: "<id>",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "addresses",
    keys: [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
    subEvents: {
      addressActivitySubEvents: [],
    },
  },
};
```

## Fields

| Field                                                                                                                                | Type                                                                                                                                 | Required                                                                                                                             | Description                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `eventType`                                                                                                                          | [components.PrimaryNetworkAddressActivityRequestEventType](../../models/components/primarynetworkaddressactivityrequesteventtype.md) | :heavy_check_mark:                                                                                                                   | N/A                                                                                                                                  |
| `url`                                                                                                                                | *string*                                                                                                                             | :heavy_check_mark:                                                                                                                   | N/A                                                                                                                                  |
| `name`                                                                                                                               | *string*                                                                                                                             | :heavy_minus_sign:                                                                                                                   | N/A                                                                                                                                  |
| `description`                                                                                                                        | *string*                                                                                                                             | :heavy_minus_sign:                                                                                                                   | N/A                                                                                                                                  |
| `network`                                                                                                                            | [components.PrimaryNetworkType](../../models/components/primarynetworktype.md)                                                       | :heavy_check_mark:                                                                                                                   | N/A                                                                                                                                  |
| `chainId`                                                                                                                            | *string*                                                                                                                             | :heavy_check_mark:                                                                                                                   | N/A                                                                                                                                  |
| `metadata`                                                                                                                           | *components.PrimaryNetworkAddressActivityRequestMetadata*                                                                            | :heavy_check_mark:                                                                                                                   | Metadata for platform address activity event                                                                                         |