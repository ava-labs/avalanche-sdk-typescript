# GetAddressesByBtcbBridgedResponse

## Example Usage

```typescript
import { GetAddressesByBtcbBridgedResponse } from "@avalanche-sdk/sdk/models/operations";

let value: GetAddressesByBtcbBridgedResponse = {
  result: {
    addresses: [
      {
        address: "0x1234567890abcdef1234567890abcdef123456789",
        sortKey: "123",
      },
    ],
  },
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `result`                                                                           | [components.LookingGlassResponse](../../models/components/lookingglassresponse.md) | :heavy_check_mark:                                                                 | N/A                                                                                |