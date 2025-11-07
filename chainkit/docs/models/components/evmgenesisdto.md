# EvmGenesisDto

## Example Usage

```typescript
import { EvmGenesisDto } from "@avalanche-sdk/chainkit/models/components";

let value: EvmGenesisDto = {
  airdropAmount: null,
  airdropHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  alloc: {
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": {
      balance: "0x52b7d2dcc80cd2e4000000",
      code: "0x6080604052...",
      storage: {
        "0x0": "0x1",
      },
    },
  },
  baseFeePerGas: null,
  blobGasUsed: null,
  coinbase: "0x0000000000000000000000000000000000000000",
  config: {
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
  },
  difficulty: "0x0",
  excessBlobGas: null,
  extraData: "0x",
  gasLimit: "0xb71b00",
  gasUsed: "0x0",
  mixHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  nonce: "0x0",
  number: "0x0",
  parentHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  timestamp: "0x64f0a000",
};
```

## Fields

| Field                                                                                                                                               | Type                                                                                                                                                | Required                                                                                                                                            | Description                                                                                                                                         | Example                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `airdropAmount`                                                                                                                                     | *number*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Airdrop amount                                                                                                                                      | <nil>                                                                                                                                               |
| `airdropHash`                                                                                                                                       | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Airdrop hash                                                                                                                                        | 0x0000000000000000000000000000000000000000000000000000000000000000                                                                                  |
| `alloc`                                                                                                                                             | Record<string, [components.EvmGenesisAllocDto](../../models/components/evmgenesisallocdto.md)>                                                      | :heavy_minus_sign:                                                                                                                                  | Allocation of accounts and balances                                                                                                                 | {<br/>"0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": {<br/>"balance": "0x52b7d2dcc80cd2e4000000",<br/>"code": "0x6080604052...",<br/>"storage": {<br/>"0x0": "0x1"<br/>}<br/>}<br/>} |
| `baseFeePerGas`                                                                                                                                     | *number*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Base fee per gas                                                                                                                                    | <nil>                                                                                                                                               |
| `blobGasUsed`                                                                                                                                       | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Blob gas used                                                                                                                                       | <nil>                                                                                                                                               |
| `coinbase`                                                                                                                                          | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Coinbase address                                                                                                                                    | 0x0000000000000000000000000000000000000000                                                                                                          |
| `config`                                                                                                                                            | [components.EvmGenesisConfigDto](../../models/components/evmgenesisconfigdto.md)                                                                    | :heavy_minus_sign:                                                                                                                                  | Genesis configuration                                                                                                                               |                                                                                                                                                     |
| `difficulty`                                                                                                                                        | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Difficulty                                                                                                                                          | 0x0                                                                                                                                                 |
| `excessBlobGas`                                                                                                                                     | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Excess blob gas                                                                                                                                     | <nil>                                                                                                                                               |
| `extraData`                                                                                                                                         | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Extra data                                                                                                                                          | 0x                                                                                                                                                  |
| `gasLimit`                                                                                                                                          | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Gas limit                                                                                                                                           | 0xb71b00                                                                                                                                            |
| `gasUsed`                                                                                                                                           | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Gas used                                                                                                                                            | 0x0                                                                                                                                                 |
| `mixHash`                                                                                                                                           | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Mix hash                                                                                                                                            | 0x0000000000000000000000000000000000000000000000000000000000000000                                                                                  |
| `nonce`                                                                                                                                             | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Nonce                                                                                                                                               | 0x0                                                                                                                                                 |
| `number`                                                                                                                                            | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Block number                                                                                                                                        | 0x0                                                                                                                                                 |
| `parentHash`                                                                                                                                        | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Parent hash                                                                                                                                         | 0x0000000000000000000000000000000000000000000000000000000000000000                                                                                  |
| `timestamp`                                                                                                                                         | *string*                                                                                                                                            | :heavy_minus_sign:                                                                                                                                  | Block timestamp                                                                                                                                     | 0x64f0a000                                                                                                                                          |