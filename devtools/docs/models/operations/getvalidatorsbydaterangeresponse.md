# GetValidatorsByDateRangeResponse

## Example Usage

```typescript
import { GetValidatorsByDateRangeResponse } from "@avalanche-sdk/devtools/models/operations";

let value: GetValidatorsByDateRangeResponse = {
  result: {
    addresses: [
      {
        addresses: [
          "avax1abcdef1234567890abcdef1234567890abcdef",
        ],
        sortKey: "123",
      },
    ],
  },
};
```

## Fields

| Field                                                                                          | Type                                                                                           | Required                                                                                       | Description                                                                                    |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `result`                                                                                       | [components.PChainLookingGlassResponse](../../models/components/pchainlookingglassresponse.md) | :heavy_check_mark:                                                                             | N/A                                                                                            |