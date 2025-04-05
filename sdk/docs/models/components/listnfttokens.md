# ListNftTokens

## Example Usage

```typescript
import { ListNftTokens } from "@avalanche-sdk/sdk/models/components";

let value: ListNftTokens = {
  tokens: [
    {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      ercType: "ERC-1155",
      tokenId: "<id>",
      tokenUri: "https://marvelous-final.net/",
      metadata: {
        indexStatus: "INVALID_TOKEN_URI",
      },
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `tokens`                                                                                                                               | *components.Token*[]                                                                                                                   | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |