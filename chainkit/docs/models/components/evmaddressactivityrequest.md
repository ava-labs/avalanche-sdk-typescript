# EVMAddressActivityRequest

## Example Usage

```typescript
import { EVMAddressActivityRequest } from "@avalanche-sdk/chainkit/models/components";

let value: EVMAddressActivityRequest = {
  eventType: "address_activity",
  url: "https://buttery-couch.biz/",
  chainId: "<id>",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    addresses: [
      "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    ],
  },
};
```

## Fields

| Field                                                                                                               | Type                                                                                                                | Required                                                                                                            | Description                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `eventType`                                                                                                         | *"address_activity"*                                                                                                | :heavy_check_mark:                                                                                                  | N/A                                                                                                                 |
| `url`                                                                                                               | *string*                                                                                                            | :heavy_check_mark:                                                                                                  | N/A                                                                                                                 |
| `name`                                                                                                              | *string*                                                                                                            | :heavy_minus_sign:                                                                                                  | N/A                                                                                                                 |
| `description`                                                                                                       | *string*                                                                                                            | :heavy_minus_sign:                                                                                                  | N/A                                                                                                                 |
| `chainId`                                                                                                           | *string*                                                                                                            | :heavy_check_mark:                                                                                                  | N/A                                                                                                                 |
| `metadata`                                                                                                          | *components.EVMAddressActivityRequestMetadata*                                                                      | :heavy_check_mark:                                                                                                  | N/A                                                                                                                 |
| `includeInternalTxs`                                                                                                | *boolean*                                                                                                           | :heavy_minus_sign:                                                                                                  | Whether to include traces in the webhook payload. Traces are only available for C-Chain on chainId 43113 and 43114. |
| `includeLogs`                                                                                                       | *boolean*                                                                                                           | :heavy_minus_sign:                                                                                                  | Whether to include logs in the webhook payload.                                                                     |