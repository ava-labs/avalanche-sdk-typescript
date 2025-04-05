# NftHoldersResponse

## Example Usage

```typescript
import { NftHoldersResponse } from "@avalanche-sdk/sdk/models/components";

let value: NftHoldersResponse = {
  addresses: [
    {
      address: "0x1234567890abcdef1234567890abcdef123456789",
      sortKey: "123",
    },
  ],
  nftCollectionName: [
    "NFT Project",
  ],
  nftSymbol: [
    "NFTPROJ",
  ],
  totalHolders: 10,
  totalTokens: 10,
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            | Example                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |                                                                                                                                        |
| `addresses`                                                                                                                            | [components.AddressDetails](../../models/components/addressdetails.md)[]                                                               | :heavy_check_mark:                                                                                                                     | List of addresses that match provided criteria.                                                                                        |                                                                                                                                        |
| `nftCollectionName`                                                                                                                    | *string*[]                                                                                                                             | :heavy_minus_sign:                                                                                                                     | NFT project name.                                                                                                                      | NFT Project                                                                                                                            |
| `nftSymbol`                                                                                                                            | *string*[]                                                                                                                             | :heavy_minus_sign:                                                                                                                     | NFT symbol.                                                                                                                            | NFTPROJ                                                                                                                                |
| `totalHolders`                                                                                                                         | *number*                                                                                                                               | :heavy_check_mark:                                                                                                                     | Total number of holders of a given NFT project.                                                                                        | 10                                                                                                                                     |
| `totalTokens`                                                                                                                          | *number*                                                                                                                               | :heavy_check_mark:                                                                                                                     | Total number of tokens of a given NFT project.                                                                                         | 10                                                                                                                                     |