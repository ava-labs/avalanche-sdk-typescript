# DataListChainsResponse

## Example Usage

```typescript
import { DataListChainsResponse } from "@avalanche-sdk/chainkit/models/components";

let value: DataListChainsResponse = {
  chains: [
    {
      chainId: "<id>",
      status: "OK",
      chainName: "<value>",
      description: "before baritone eek colorfully usually rigidly yippee",
      vmName: "BITCOIN",
      rpcUrl: "https://grimy-management.name",
      isTestnet: true,
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