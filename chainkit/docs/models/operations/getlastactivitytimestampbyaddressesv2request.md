# GetLastActivityTimestampByAddressesV2Request

## Example Usage

```typescript
import { GetLastActivityTimestampByAddressesV2Request } from "@avalanche-sdk/chainkit/models/operations";

let value: GetLastActivityTimestampByAddressesV2Request = {
  blockchainId: "p-chain",
  primaryNetworkAddressesBodyDto: {
    addresses: "P-avax1abc123,X-avax1def456,C-avax1ghi789",
  },
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            | Example                                                                                                |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `blockchainId`                                                                                         | [components.BlockchainId](../../models/components/blockchainid.md)                                     | :heavy_check_mark:                                                                                     | A primary network blockchain id or alias.                                                              | p-chain                                                                                                |
| `network`                                                                                              | [components.GlobalParamNetwork](../../models/components/globalparamnetwork.md)                         | :heavy_minus_sign:                                                                                     | Either mainnet or testnet/fuji.                                                                        | mainnet                                                                                                |
| `primaryNetworkAddressesBodyDto`                                                                       | [components.PrimaryNetworkAddressesBodyDto](../../models/components/primarynetworkaddressesbodydto.md) | :heavy_check_mark:                                                                                     | N/A                                                                                                    |                                                                                                        |