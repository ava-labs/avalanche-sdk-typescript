# ListNftTokens

## Example Usage

```typescript
import { ListNftTokens } from "@avalanche-sdk/data/models/components";

let value: ListNftTokens = {
  tokens: [
    {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      ercType: "ERC-721",
      tokenId: "<id>",
      tokenUri: "https://gracious-reservation.biz/",
      metadata: {
        indexStatus: "THROTTLED_TOKEN_URI",
      },
      ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `tokens`                                                                                                                               | *components.Token*[]                                                                                                                   | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |