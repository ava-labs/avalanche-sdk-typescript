# GetAddressesByBalanceOverTimeResponse

## Example Usage

```typescript
import { GetAddressesByBalanceOverTimeResponse } from "@avalanche-sdk/devtools/models/operations";

let value: GetAddressesByBalanceOverTimeResponse = {
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