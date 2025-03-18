# ListWebhooksResponse

## Example Usage

```typescript
import { ListWebhooksResponse } from "@avalanche-sdk/webhooks/models/operations";

let value: ListWebhooksResponse = {
  result: {
    webhooks: [
      {
        id: "<id>",
        eventType: "validator_activity",
        url: "https://grouchy-plain.org/",
        chainId: "<id>",
        status: "inactive",
        createdAt: 2826.99,
        name: "<value>",
        description: "holster minority eek",
        metadata: {
          keyType: "subnetId",
          keys: [
            "<value>",
          ],
          eventSignatures: [
            "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
          ],
        },
      },
    ],
  },
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `result`                                                                           | [components.ListWebhooksResponse](../../models/components/listwebhooksresponse.md) | :heavy_check_mark:                                                                 | N/A                                                                                |