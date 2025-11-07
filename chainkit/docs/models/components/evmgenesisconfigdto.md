# EvmGenesisConfigDto

## Example Usage

```typescript
import { EvmGenesisConfigDto } from "@avalanche-sdk/chainkit/models/components";

let value: EvmGenesisConfigDto = {
  berlinBlock: 0,
  byzantiumBlock: 0,
  chainId: 43114,
  constantinopleBlock: 0,
  eip150Block: 0,
  eip150Hash:
    "0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0",
  eip155Block: 0,
  eip158Block: 0,
  feeConfig: {
    baseFeeChangeDenominator: 36,
    blockGasCostStep: 200000,
    gasLimit: 12000000,
    maxBlockGasCost: 1000000,
    minBaseFee: 25000000000,
    minBlockGasCost: 0,
    targetBlockRate: 2,
    targetGas: 60000000,
  },
  homesteadBlock: 0,
  istanbulBlock: 0,
  londonBlock: 0,
  muirGlacierBlock: 0,
  petersburgBlock: 0,
  subnetEVMTimestamp: 0,
  allowFeeRecipients: false,
  warpConfig: {
    blockTimestamp: 1690000000,
    quorumNumerator: 67,
    requirePrimaryNetworkSigners: true,
  },
  txAllowListConfig: {
    blockTimestamp: 0,
    adminAddresses: [
      "0x1234...",
    ],
    managerAddresses: [
      "0x5678...",
    ],
    enabledAddresses: [
      "0x9abc...",
    ],
  },
  contractDeployerAllowListConfig: {
    blockTimestamp: 0,
    adminAddresses: [
      "0x1234...",
    ],
    managerAddresses: [
      "0x5678...",
    ],
    enabledAddresses: [
      "0x9abc...",
    ],
  },
  contractNativeMinterConfig: {
    blockTimestamp: 0,
    adminAddresses: [
      "0x1234...",
    ],
    managerAddresses: [
      "0x5678...",
    ],
    enabledAddresses: [
      "0x9abc...",
    ],
  },
  feeManagerConfig: {
    blockTimestamp: 0,
    adminAddresses: [
      "0x1234...",
    ],
    managerAddresses: [
      "0x5678...",
    ],
    enabledAddresses: [
      "0x9abc...",
    ],
  },
  rewardManagerConfig: {
    blockTimestamp: 0,
    adminAddresses: [
      "0x1234...",
    ],
    managerAddresses: [
      "0x5678...",
    ],
    enabledAddresses: [
      "0x9abc...",
    ],
  },
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        | Example                                                                                            |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `berlinBlock`                                                                                      | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Berlin block number                                                                                | 0                                                                                                  |
| `byzantiumBlock`                                                                                   | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Byzantium block number                                                                             | 0                                                                                                  |
| `chainId`                                                                                          | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Chain ID                                                                                           | 43114                                                                                              |
| `constantinopleBlock`                                                                              | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Constantinople block number                                                                        | 0                                                                                                  |
| `eip150Block`                                                                                      | *number*                                                                                           | :heavy_minus_sign:                                                                                 | EIP-150 block number                                                                               | 0                                                                                                  |
| `eip150Hash`                                                                                       | *string*                                                                                           | :heavy_minus_sign:                                                                                 | EIP-150 hash                                                                                       | 0x2086799aeebeae135c246c65021c82b4e15a2c451340993aacfd2751886514f0                                 |
| `eip155Block`                                                                                      | *number*                                                                                           | :heavy_minus_sign:                                                                                 | EIP-155 block number                                                                               | 0                                                                                                  |
| `eip158Block`                                                                                      | *number*                                                                                           | :heavy_minus_sign:                                                                                 | EIP-158 block number                                                                               | 0                                                                                                  |
| `feeConfig`                                                                                        | [components.EvmGenesisFeeConfigDto](../../models/components/evmgenesisfeeconfigdto.md)             | :heavy_minus_sign:                                                                                 | Fee configuration                                                                                  |                                                                                                    |
| `homesteadBlock`                                                                                   | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Homestead block number                                                                             | 0                                                                                                  |
| `istanbulBlock`                                                                                    | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Istanbul block number                                                                              | 0                                                                                                  |
| `londonBlock`                                                                                      | *number*                                                                                           | :heavy_minus_sign:                                                                                 | London block number                                                                                | 0                                                                                                  |
| `muirGlacierBlock`                                                                                 | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Muir Glacier block number                                                                          | 0                                                                                                  |
| `petersburgBlock`                                                                                  | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Petersburg block number                                                                            | 0                                                                                                  |
| `subnetEVMTimestamp`                                                                               | *number*                                                                                           | :heavy_minus_sign:                                                                                 | Subnet EVM timestamp                                                                               | 0                                                                                                  |
| `allowFeeRecipients`                                                                               | *boolean*                                                                                          | :heavy_minus_sign:                                                                                 | Allow fee recipients                                                                               | false                                                                                              |
| `warpConfig`                                                                                       | [components.EvmGenesisWarpConfigDto](../../models/components/evmgenesiswarpconfigdto.md)           | :heavy_minus_sign:                                                                                 | Warp configuration                                                                                 |                                                                                                    |
| `txAllowListConfig`                                                                                | [components.EvmGenesisAllowListConfigDto](../../models/components/evmgenesisallowlistconfigdto.md) | :heavy_minus_sign:                                                                                 | Transaction allow list configuration                                                               |                                                                                                    |
| `contractDeployerAllowListConfig`                                                                  | [components.EvmGenesisAllowListConfigDto](../../models/components/evmgenesisallowlistconfigdto.md) | :heavy_minus_sign:                                                                                 | Contract deployer allow list configuration                                                         |                                                                                                    |
| `contractNativeMinterConfig`                                                                       | [components.EvmGenesisAllowListConfigDto](../../models/components/evmgenesisallowlistconfigdto.md) | :heavy_minus_sign:                                                                                 | Contract native minter configuration                                                               |                                                                                                    |
| `feeManagerConfig`                                                                                 | [components.EvmGenesisAllowListConfigDto](../../models/components/evmgenesisallowlistconfigdto.md) | :heavy_minus_sign:                                                                                 | Fee manager configuration                                                                          |                                                                                                    |
| `rewardManagerConfig`                                                                              | [components.EvmGenesisAllowListConfigDto](../../models/components/evmgenesisallowlistconfigdto.md) | :heavy_minus_sign:                                                                                 | Reward manager configuration                                                                       |                                                                                                    |