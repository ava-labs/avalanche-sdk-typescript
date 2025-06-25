# BlockchainInfoGenesisData

The genesis data of the blockchain.  Present for CreateChainTx. EVM based chains will return the genesis data as an object. Non-EVM based chains will return the genesis data as an encoded string. The encoding depends on the VM

## Example Usage

```typescript
import { BlockchainInfoGenesisData } from "@avalanche-sdk/devtools/models/components";

let value: BlockchainInfoGenesisData = {};
```

## Fields

| Field       | Type        | Required    | Description |
| ----------- | ----------- | ----------- | ----------- |