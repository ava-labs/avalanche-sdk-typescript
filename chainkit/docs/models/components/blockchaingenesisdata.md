# BlockchainGenesisData

The genesis data of the blockchain. Can be either a parsed EvmGenesisDto object or a raw JSON string.


## Supported Types

### `components.EvmGenesisDto`

```typescript
const value: components.EvmGenesisDto = {
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

### `string`

```typescript
const value: string = "{\"chainId\": 43114}";
```

