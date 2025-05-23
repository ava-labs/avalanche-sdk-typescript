# GetTransactionResponse

## Example Usage

```typescript
import { GetTransactionResponse } from "@avalanche-sdk/sdk/models/components";

let value: GetTransactionResponse = {
  erc20Transfers: [
    {
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
      logIndex: 9911.22,
      value: "10000000000000000000",
      erc20Token: {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        name: "Wrapped AVAX",
        symbol: "WAVAX",
        decimals: 18,
        logoUri:
          "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
        ercType: "ERC-20",
        price: {
          currencyCode: "usd",
          value: 42.42,
        },
      },
    },
  ],
  erc721Transfers: [
    {
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
      logIndex: 8114,
      erc721Token: {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        name: "Wrapped AVAX",
        symbol: "WAVAX",
        ercType: "ERC-721",
        tokenId: "<id>",
        tokenUri: "https://stupendous-sauerkraut.biz/",
        metadata: {
          indexStatus: "UNKNOWN",
        },
        ownerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      },
    },
  ],
  erc1155Transfers: [
    {
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
      logIndex: 5326.3,
      value: "10000000000000000000",
      erc1155Token: {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        ercType: "ERC-1155",
        tokenId: "<id>",
        tokenUri: "https://clumsy-term.biz",
        metadata: {
          indexStatus: "UNINDEXED",
        },
      },
    },
  ],
  internalTransactions: [
    {
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
      internalTxType: "CALL",
      value: "10000000000000000000",
      isReverted: false,
      gasUsed: "<value>",
      gasLimit: "<value>",
    },
  ],
  networkTokenDetails: {
    networkToken: {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimals: 18,
      logoUri:
        "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
    },
    currentPrice: {
      currencyCode: "usd",
      value: 42.42,
    },
    historicalPrice: {
      currencyCode: "usd",
      value: 42.42,
    },
  },
  nativeTransaction: {
    blockNumber: "339",
    blockTimestamp: 1648672486,
    blockHash:
      "0x17533aeb5193378b9ff441d61728e7a2ebaf10f61fd5310759451627dfca2e7c",
    chainId: "43114",
    blockIndex: 0,
    txHash:
      "0x3e9303f81be00b4af28515dab7b914bf3dbff209ea10e7071fa24d4af0a112d4",
    txStatus: "1",
    txType: 1,
    gasLimit: "51373",
    gasUsed: "51373",
    gasPrice: "470000000000",
    nonce: "1",
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
    method: {
      callType: "NATIVE_TRANSFER",
      methodHash: "0xa9059cbb",
      methodName: "transfer(address,uint256)",
    },
    value: "10000000000000000000",
    input: "<value>",
    baseFeePerGas: "<value>",
  },
};
```

## Fields

| Field                                                                                                                                                                                                                                             | Type                                                                                                                                                                                                                                              | Required                                                                                                                                                                                                                                          | Description                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `erc20Transfers`                                                                                                                                                                                                                                  | [components.Erc20TransferDetails](../../models/components/erc20transferdetails.md)[]                                                                                                                                                              | :heavy_minus_sign:                                                                                                                                                                                                                                | The list of ERC-20 transfers.                                                                                                                                                                                                                     |
| `erc721Transfers`                                                                                                                                                                                                                                 | [components.Erc721TransferDetails](../../models/components/erc721transferdetails.md)[]                                                                                                                                                            | :heavy_minus_sign:                                                                                                                                                                                                                                | The list of ERC-721 transfers.                                                                                                                                                                                                                    |
| `erc1155Transfers`                                                                                                                                                                                                                                | [components.Erc1155TransferDetails](../../models/components/erc1155transferdetails.md)[]                                                                                                                                                          | :heavy_minus_sign:                                                                                                                                                                                                                                | The list of ERC-1155 transfers.                                                                                                                                                                                                                   |
| `internalTransactions`                                                                                                                                                                                                                            | [components.InternalTransactionDetails](../../models/components/internaltransactiondetails.md)[]                                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                                                                                                | The list of internal transactions. Note that this list only includes CALL and CALLCODE internal transactions that had a non-zero value and CREATE/CREATE2/CREATE3  calls. Use a client provider to recieve a full debug trace of the transaction. |
| `networkTokenDetails`                                                                                                                                                                                                                             | [components.NetworkTokenDetails](../../models/components/networktokendetails.md)                                                                                                                                                                  | :heavy_check_mark:                                                                                                                                                                                                                                | N/A                                                                                                                                                                                                                                               |
| `nativeTransaction`                                                                                                                                                                                                                               | [components.FullNativeTransactionDetails](../../models/components/fullnativetransactiondetails.md)                                                                                                                                                | :heavy_check_mark:                                                                                                                                                                                                                                | N/A                                                                                                                                                                                                                                               |
| `teleporterMessageInfo`                                                                                                                                                                                                                           | [components.TeleporterMessageInfo](../../models/components/teleportermessageinfo.md)                                                                                                                                                              | :heavy_minus_sign:                                                                                                                                                                                                                                | Corresponding teleporter message info if available.                                                                                                                                                                                               |