# ListWebhooksResponse

## Example Usage

```typescript
import { ListWebhooksResponse } from "@avalanche-sdk/webhooks/models/components";

let value: ListWebhooksResponse = {
  webhooks: [
    {
      id: "<id>",
      eventType: "platform_address_activity",
      url: "https://superior-creature.net/",
      chainId: "<id>",
      status: "active",
      createdAt: 6534.96,
      name: "<value>",
      description:
        "meh kettledrum posh ha dissemble place stealthily trolley owlishly heartache",
      metadata: {
        addresses: [
          "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        ],
        eventSignatures: [
          "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
        ],
      },
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `webhooks`                                                                                                                             | *components.Webhook*[]                                                                                                                 | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |