# ListLatestTransactionsAllChainsResponse

## Example Usage

```typescript
import { ListLatestTransactionsAllChainsResponse } from "@avalanche-sdk/data/models/operations";

let value: ListLatestTransactionsAllChainsResponse = {
  result: {
    transactions: [
      {
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
      },
    ],
  },
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `result`                                                                                               | [components.ListNativeTransactionsResponse](../../models/components/listnativetransactionsresponse.md) | :heavy_check_mark:                                                                                     | N/A                                                                                                    |