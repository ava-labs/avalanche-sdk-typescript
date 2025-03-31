# ListTokensResponse

## Example Usage

```typescript
import { ListTokensResponse } from "@avalanche-sdk/data/models/operations";

let value: ListTokensResponse = {
  result: {
    tokens: [
      {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        ercType: "ERC-1155",
        tokenId: "<id>",
        tokenUri: "https://uniform-daughter.name",
        metadata: {
          indexStatus: "MISSING_TOKEN",
        },
      },
    ],
  },
};
```

## Fields

| Field                                                                | Type                                                                 | Required                                                             | Description                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `result`                                                             | [components.ListNftTokens](../../models/components/listnfttokens.md) | :heavy_check_mark:                                                   | N/A                                                                  |