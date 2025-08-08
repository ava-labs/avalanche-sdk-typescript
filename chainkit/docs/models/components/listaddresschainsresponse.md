# ListAddressChainsResponse

## Example Usage

```typescript
import { ListAddressChainsResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ListAddressChainsResponse = {
  indexedChains: [
    {
      chainId: "<id>",
      status: "OK",
      chainName: "<value>",
      description: "pro needy lavish energetic excepting serpentine",
      vmName: "BITCOIN",
      rpcUrl: "https://true-newsprint.biz",
      isTestnet: false,
      networkToken: {
        name: "Wrapped AVAX",
        symbol: "WAVAX",
        decimals: 18,
        logoUri:
          "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
      },
    },
  ],
};
```

## Fields

| Field                                                          | Type                                                           | Required                                                       | Description                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `indexedChains`                                                | [components.ChainInfo](../../models/components/chaininfo.md)[] | :heavy_minus_sign:                                             | N/A                                                            |
| `unindexedChains`                                              | *string*[]                                                     | :heavy_minus_sign:                                             | N/A                                                            |