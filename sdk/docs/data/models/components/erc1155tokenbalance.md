# Erc1155TokenBalance

## Example Usage

```typescript
import { Erc1155TokenBalance } from "@avalanche-sdk/sdk/data/models/components";

let value: Erc1155TokenBalance = {
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  ercType: "ERC-1155",
  tokenId: "<id>",
  tokenUri: "https://other-swine.net",
  metadata: {
    indexStatus: "INVALID_METADATA",
  },
  chainId: "43114",
  balance: "2000000000000000000",
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     | Example                                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `address`                                                                                       | *string*                                                                                        | :heavy_check_mark:                                                                              | A wallet or contract address in mixed-case checksum encoding.                                   | 0x71C7656EC7ab88b098defB751B7401B5f6d8976F                                                      |
| `ercType`                                                                                       | [components.Erc1155TokenBalanceErcType](../../models/components/erc1155tokenbalanceerctype.md)  | :heavy_check_mark:                                                                              | N/A                                                                                             |                                                                                                 |
| `tokenId`                                                                                       | *string*                                                                                        | :heavy_check_mark:                                                                              | N/A                                                                                             |                                                                                                 |
| `tokenUri`                                                                                      | *string*                                                                                        | :heavy_check_mark:                                                                              | N/A                                                                                             |                                                                                                 |
| `metadata`                                                                                      | [components.Erc1155TokenMetadata](../../models/components/erc1155tokenmetadata.md)              | :heavy_check_mark:                                                                              | N/A                                                                                             |                                                                                                 |
| `chainId`                                                                                       | *string*                                                                                        | :heavy_check_mark:                                                                              | The evm chain id.                                                                               | 43114                                                                                           |
| `balance`                                                                                       | *string*                                                                                        | :heavy_check_mark:                                                                              | The address balance for the token, in units specified by the `decimals` value for the contract. | 2000000000000000000                                                                             |