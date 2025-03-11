# ListChainsResponse

## Example Usage

```typescript
import { ListChainsResponse } from "@avalanche-sdk/data/models/components";

let value: ListChainsResponse = {
  chains: [
    {
      chainId: "<id>",
      status: "UNAVAILABLE",
      chainName: "<value>",
      description: "dishearten unaccountably unconscious",
      vmName: "ETHEREUM",
      rpcUrl: "https://mature-vanadyl.name",
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
| `chains`                                                       | [components.ChainInfo](../../models/components/chaininfo.md)[] | :heavy_check_mark:                                             | N/A                                                            |