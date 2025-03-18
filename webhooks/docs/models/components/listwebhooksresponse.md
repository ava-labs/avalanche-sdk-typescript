# ListWebhooksResponse

## Example Usage

```typescript
import { ListWebhooksResponse } from "@avalanche-sdk/webhooks/models/components";

let value: ListWebhooksResponse = {
  webhooks: [
    {
      id: "<id>",
      eventType: "address_activity",
      url: "https://waterlogged-sediment.name",
      chainId: "<id>",
      status: "inactive",
      createdAt: 2930.2,
      name: "<value>",
      description:
        "mash astride fidget abaft knottily ethyl covenant jaggedly where",
      metadata: {
        keyType: "addresses",
        keys: [
          "<value>",
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