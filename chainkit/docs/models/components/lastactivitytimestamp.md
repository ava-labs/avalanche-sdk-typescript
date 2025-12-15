# LastActivityTimestamp

## Example Usage

```typescript
import { LastActivityTimestamp } from "@avalanche-sdk/chainkit/models/components";

let value: LastActivityTimestamp = {
  timestamp: 7002.89,
  blockNumber: "<value>",
  txHash: "<value>",
  utxoId: "<id>",
  isConsumed: true,
  chainName: "c-chain",
  network: "fuji",
};
```

## Fields

| Field                                                                                    | Type                                                                                     | Required                                                                                 | Description                                                                              |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `timestamp`                                                                              | *number*                                                                                 | :heavy_check_mark:                                                                       | Unix timestamp in seconds at which the last activity occurred.                           |
| `blockNumber`                                                                            | *string*                                                                                 | :heavy_check_mark:                                                                       | Block height at which the last activity occurred.                                        |
| `txHash`                                                                                 | *string*                                                                                 | :heavy_check_mark:                                                                       | Transaction hash of the transaction that created or consumed the address' UTXOs.         |
| `utxoId`                                                                                 | *string*                                                                                 | :heavy_check_mark:                                                                       | UTXO ID of the UTXO that was created or consumed.                                        |
| `isConsumed`                                                                             | *boolean*                                                                                | :heavy_check_mark:                                                                       | Whether the last activity was a consumption of an existing UTXO.                         |
| `chainName`                                                                              | [components.PrimaryNetworkChainName](../../models/components/primarynetworkchainname.md) | :heavy_check_mark:                                                                       | N/A                                                                                      |
| `network`                                                                                | [components.PrimaryNetworkType](../../models/components/primarynetworktype.md)           | :heavy_check_mark:                                                                       | N/A                                                                                      |