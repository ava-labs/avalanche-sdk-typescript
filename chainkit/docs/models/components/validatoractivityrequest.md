# ValidatorActivityRequest

## Example Usage

```typescript
import { ValidatorActivityRequest } from "@avalanche-sdk/chainkit/models/components";

let value: ValidatorActivityRequest = {
  eventType: "validator_activity",
  url: "https://cultivated-archaeology.biz/",
  network: "fuji",
  metadata: {
    eventSignatures: [
      "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
    ],
    keyType: "nodeId",
    keys: [],
    subEvents: {
      validatorActivitySubEvents: [],
    },
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `eventType`                                                                    | *"validator_activity"*                                                         | :heavy_check_mark:                                                             | N/A                                                                            |
| `url`                                                                          | *string*                                                                       | :heavy_check_mark:                                                             | N/A                                                                            |
| `name`                                                                         | *string*                                                                       | :heavy_minus_sign:                                                             | N/A                                                                            |
| `description`                                                                  | *string*                                                                       | :heavy_minus_sign:                                                             | N/A                                                                            |
| `network`                                                                      | [components.PrimaryNetworkType](../../models/components/primarynetworktype.md) | :heavy_check_mark:                                                             | N/A                                                                            |
| `metadata`                                                                     | *components.ValidatorActivityRequestMetadata*                                  | :heavy_check_mark:                                                             | Metadata for platform validator activity event                                 |