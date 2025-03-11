# GetNftHoldersByContractAddressResponse

## Example Usage

```typescript
import { GetNftHoldersByContractAddressResponse } from "@avalanche-sdk/metrics/models/operations";

let value: GetNftHoldersByContractAddressResponse = {
  result: {
    addresses: [
      {
        address: "0x1234567890abcdef1234567890abcdef123456789",
        sortKey: "123",
      },
    ],
    nftCollectionName: [
      "NFT Project",
    ],
    nftSymbol: [
      "NFTPROJ",
    ],
    totalHolders: 10,
    totalTokens: 10,
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `result`                                                                       | [components.NftHoldersResponse](../../models/components/nftholdersresponse.md) | :heavy_check_mark:                                                             | N/A                                                                            |