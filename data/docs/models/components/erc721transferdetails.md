# Erc721TransferDetails

## Example Usage

```typescript
import { Erc721TransferDetails } from "@avalanche-sdk/data/models/components";

let value: Erc721TransferDetails = {
  from: {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    decimals: 18,
    logoUri:
      "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  to: {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    decimals: 18,
    logoUri:
      "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  logIndex: 7301.22,
  erc721Token: {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    ercType: "ERC-721",
    tokenId: "<id>",
    tokenUri: "https://impeccable-cruelty.biz/",
    metadata: {
      indexStatus: "UNINDEXED",
    },
    ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
};
```

## Fields

| Field                                                            | Type                                                             | Required                                                         | Description                                                      |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `from`                                                           | [components.RichAddress](../../models/components/richaddress.md) | :heavy_check_mark:                                               | N/A                                                              |
| `to`                                                             | [components.RichAddress](../../models/components/richaddress.md) | :heavy_check_mark:                                               | N/A                                                              |
| `logIndex`                                                       | *number*                                                         | :heavy_check_mark:                                               | N/A                                                              |
| `erc721Token`                                                    | [components.Erc721Token](../../models/components/erc721token.md) | :heavy_check_mark:                                               | N/A                                                              |