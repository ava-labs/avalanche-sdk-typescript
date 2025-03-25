# Token


## Supported Types

### `components.Erc721Token`

```typescript
const value: components.Erc721Token = {
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  name: "Wrapped AVAX",
  symbol: "WAVAX",
  ercType: "ERC-721",
  tokenId: "<id>",
  tokenUri: "https://overdue-story.info/",
  metadata: {
    indexStatus: "UNINDEXED",
  },
  ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
};
```

### `components.Erc1155Token`

```typescript
const value: components.Erc1155Token = {
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  ercType: "ERC-1155",
  tokenId: "<id>",
  tokenUri: "https://sugary-thongs.net",
  metadata: {
    indexStatus: "MISSING_TOKEN",
  },
};
```

