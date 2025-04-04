# PlatformActivityRequest

## Example Usage

```typescript
import { PlatformActivityRequest } from "@avalanche-sdk/devtools/models/components";

let value: PlatformActivityRequest = {
  eventType: "validator_activity",
  url: "https://untrue-parsnip.com",
  chainId: "<id>",
  metadata: {
    keyType: "nodeId",
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

| Field                                                                                                               | Type                                                                                                                | Required                                                                                                            | Description                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `eventType`                                                                                                         | [components.PlatformActivityRequestEventType](../../models/components/platformactivityrequesteventtype.md)          | :heavy_check_mark:                                                                                                  | N/A                                                                                                                 |
| `url`                                                                                                               | *string*                                                                                                            | :heavy_check_mark:                                                                                                  | N/A                                                                                                                 |
| `chainId`                                                                                                           | *string*                                                                                                            | :heavy_check_mark:                                                                                                  | N/A                                                                                                                 |
| `network`                                                                                                           | [components.PrimaryNetworkType](../../models/components/primarynetworktype.md)                                      | :heavy_minus_sign:                                                                                                  | N/A                                                                                                                 |
| `name`                                                                                                              | *string*                                                                                                            | :heavy_minus_sign:                                                                                                  | N/A                                                                                                                 |
| `description`                                                                                                       | *string*                                                                                                            | :heavy_minus_sign:                                                                                                  | N/A                                                                                                                 |
| `includeInternalTxs`                                                                                                | *boolean*                                                                                                           | :heavy_minus_sign:                                                                                                  | Whether to include traces in the webhook payload. Traces are only available for C-Chain on chainId 43113 and 43114. |
| `includeLogs`                                                                                                       | *boolean*                                                                                                           | :heavy_minus_sign:                                                                                                  | Whether to include logs in the webhook payload.                                                                     |
| `metadata`                                                                                                          | *components.PlatformActivityRequestMetadata*                                                                        | :heavy_check_mark:                                                                                                  | Metadata for platform activity                                                                                      |