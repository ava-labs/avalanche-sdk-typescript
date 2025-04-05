# Erc1155Token

## Example Usage

```typescript
import { Erc1155Token } from "@avalanche-sdk/sdk/models/components";

let value: Erc1155Token = {
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  ercType: "ERC-1155",
  tokenId: "<id>",
  tokenUri: "https://babyish-adult.name",
  metadata: {
    indexStatus: "UNKNOWN",
  },
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        | Example                                                                            |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `address`                                                                          | *string*                                                                           | :heavy_check_mark:                                                                 | A wallet or contract address in mixed-case checksum encoding.                      | 0x71C7656EC7ab88b098defB751B7401B5f6d8976F                                         |
| `ercType`                                                                          | [components.Erc1155TokenErcType](../../models/components/erc1155tokenerctype.md)   | :heavy_check_mark:                                                                 | N/A                                                                                |                                                                                    |
| `tokenId`                                                                          | *string*                                                                           | :heavy_check_mark:                                                                 | N/A                                                                                |                                                                                    |
| `tokenUri`                                                                         | *string*                                                                           | :heavy_check_mark:                                                                 | N/A                                                                                |                                                                                    |
| `metadata`                                                                         | [components.Erc1155TokenMetadata](../../models/components/erc1155tokenmetadata.md) | :heavy_check_mark:                                                                 | N/A                                                                                |                                                                                    |