# Erc721TokenBalance

## Example Usage

```typescript
import { Erc721TokenBalance } from "@avalanche-sdk/data/models/components";

let value: Erc721TokenBalance = {
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  name: "Wrapped AVAX",
  symbol: "WAVAX",
  ercType: "ERC-721",
  tokenId: "<id>",
  tokenUri: "https://normal-skeleton.info",
  metadata: {
    indexStatus: "THROTTLED_TOKEN_URI",
  },
  ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  chainId: "43114",
};
```

## Fields

| Field                                                                                        | Type                                                                                         | Required                                                                                     | Description                                                                                  | Example                                                                                      |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `address`                                                                                    | *string*                                                                                     | :heavy_check_mark:                                                                           | A wallet or contract address in mixed-case checksum encoding.                                | 0x71C7656EC7ab88b098defB751B7401B5f6d8976F                                                   |
| `name`                                                                                       | *string*                                                                                     | :heavy_check_mark:                                                                           | The contract name.                                                                           | Wrapped AVAX                                                                                 |
| `symbol`                                                                                     | *string*                                                                                     | :heavy_check_mark:                                                                           | The contract symbol.                                                                         | WAVAX                                                                                        |
| `ercType`                                                                                    | [components.Erc721TokenBalanceErcType](../../models/components/erc721tokenbalanceerctype.md) | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `tokenId`                                                                                    | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `tokenUri`                                                                                   | *string*                                                                                     | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `metadata`                                                                                   | [components.Erc721TokenMetadata](../../models/components/erc721tokenmetadata.md)             | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
| `ownerAddress`                                                                               | *string*                                                                                     | :heavy_minus_sign:                                                                           | A wallet or contract address in mixed-case checksum encoding.                                | 0x71C7656EC7ab88b098defB751B7401B5f6d8976F                                                   |
| `chainId`                                                                                    | *string*                                                                                     | :heavy_check_mark:                                                                           | The evm chain id.                                                                            | 43114                                                                                        |