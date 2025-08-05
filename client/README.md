# Avalanche SDK Client

A TypeScript SDK for interacting with the Avalanche network through JSON-RPC APIs. This SDK provides a comprehensive set of tools to interact with all Avalanche chains (P-Chain, X-Chain, C-Chain) and various APIs, including wallet functionality for transaction signing and management.

## Installation

```bash
npm install @avalanche-sdk/client
# or
yarn add @avalanche-sdk/client
# or
pnpm add @avalanche-sdk/client
```

## Quick Start

### Avalanche Client Usage

```typescript
import { createAvalancheClient } from '@avalanche-sdk/client'
import { avalanche } from '@avalanche-sdk/client/chains'

// Create an Avalanche client
const client = createAvalancheClient({
  chain: avalanche,
  transport: {
    type: "http",
  },
})

// Access different chain clients
const pChainClient = client.pChain
const xChainClient = client.xChain
const cChainClient = client.cChain

// Access API clients
const adminClient = client.admin
const infoClient = client.info
const healthClient = client.health
const indexPChainBlockClient = client.indexPChainBlock

// Example: Get the latest block number
const blockNumber = await pChainClient.getBlockNumber()

// Example: Get base fee
const baseFee = await client.getBaseFee()
```

### Wallet Client Usage

```typescript
import { createAvalancheWalletClient, privateKeyToAvalancheAccount } from '@avalanche-sdk/client'
import { avalanche } from '@avalanche-sdk/client/chains'

// Create an account from private key
const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890123456789012345678901234")

// Get P chain Address and Evm Address
const evmAddress = account.getEVMAddress()
const pchainAddress = account.getXPAddress("P", "fuji")

// Create a wallet client
const walletClient = createAvalancheWalletClient({
  account,
  chain: avalanche,
  transport: {
    type: "http",
  },
})

// Prepare a txn request
const xChainExportTxnRequest = await walletClient.xChain.prepareExportTxn({
  exportedOutputs: [
    {
      addresses: [account.getXPAddress("X", "fuji")], // X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
      amount: 0.001,
    },
  ],
  destinationChain: "P",
});

// Send an XP transaction
const result = await walletClient.sendXPTransaction(xChainExportTxnRequest)

// Sign a message
const signedMessage = await walletClient.signXPMessage({
  message: "Hello Avalanche",
})

// Get account public key
const pubKey = await walletClient.getAccountPubKey()

// Wait for transaction confirmation
await walletClient.waitForTxn({
  txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
  chainAlias: "X"
})
```

### Chain-Specific Wallet Operations

```typescript
// P-Chain wallet operations
const pChainWallet = walletClient.pChain

// Prepare add validator transaction
const validatorTx = await pChainWallet.prepareAddPermissionlessValidatorTxn({
  nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
  stakeInAvax: 1,
  end: 1716441600,
  rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
  threshold: 1,
  publicKey: "0x1234567890123456789012345678901234567890",
  signature: "0x1234567890123456789012345678901234567890",
  locktime: 1716441600,
  delegatorRewardPercentage: 2.5,
  delegatorRewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
})

// X-Chain wallet operations
const xChainWallet = walletClient.xChain

// Prepare base transaction
const baseTx = await xChainWallet.prepareBaseTxn({
  outputs: [{
    addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    amount: 1000000000, // 1 AVAX
  }],
})

// C-Chain wallet operations
const cChainWallet = walletClient.cChain

// Prepare export transaction
const exportTx = await cChainWallet.prepareExportTxn({
  to: "P-fuji1j2zllfqv4mgg7ytn9m2u2x0q3h3jqkzq8q8q8q8",
  amount: "1000000000000000000", // 1 AVAX in wei
  destinationChain: "X"
})
```

## Features

- **Multi-Chain Support**: Interact with all Avalanche chains:
  - P-Chain (Platform Chain)
  - X-Chain (Exchange Chain)
  - C-Chain (Contract Chain)
- **Wallet Functionality**: Complete wallet operations including:
  - Transaction signing and sending
  - Message signing
  - Account management
  - Chain-specific transaction preparation
- **API Clients**:
  - Admin API
  - Info API
  - Health API
  - Index API
- **TypeScript Support**: Full TypeScript support with type definitions
- **Modular Design**: Access specific functionality through dedicated clients

## Available Clients

### Chain Clients

- **P-Chain Client**: Platform Chain operations
- **X-Chain Client**: Exchange Chain operations
- **C-Chain Client**: Contract Chain operations

### API Clients

- **Admin Client**: Administrative operations
- **Info Client**: Network information
- **Health Client**: Health check endpoints
- **Index Clients**:
  - Index P-Chain Block
  - Index C-Chain Block
  - Index X-Chain Block
  - Index X-Chain Transaction

### Wallet Clients

- **Avalanche Wallet Client**: General wallet operations
- **P-Chain Wallet Client**: P-Chain specific wallet operations
- **X-Chain Wallet Client**: X-Chain specific wallet operations
- **C-Chain Wallet Client**: C-Chain specific wallet operations

## Configuration

The SDK can be configured with various options:

```typescript
const client = createAvalancheClient({
  chain: avalanche, // Chain configuration
  transport: {
    type: "<transportType>", // Transport type
    url: "<url>",
  },
  apiKey: "", // Optional API key
  rlToken: "", // Optional rate limit token
})
```

## Exported Modules and Utilities

### Main Exports

The SDK exports all viem utilities and types, plus Avalanche-specific functionality:

```typescript
import { 
  createAvalancheClient,
  createAvalancheWalletClient,
  // All viem exports
  createClient,
  createPublicClient,
  createWalletClient,
  // ... and many more
} from '@avalanche-sdk/client'
```

### Account Management

```typescript
import { 
  privateKeyToAvalancheAccount,
  memonicsToAvalancheAccount,
  hdKeyToAvalancheAccount,
  privateKeyToXPAddress,
  publicKeyToXPAddress,
  // ... and more
} from '@avalanche-sdk/client/accounts'
```

### Chain Configurations

```typescript
import { 
  avalanche,
  avalancheFuji,
  // ... and more
} from '@avalanche-sdk/client/chains'
```

### Methods

Access specific method categories:

```typescript
// P-Chain methods
import { /* P-Chain methods */ } from '@avalanche-sdk/client/methods/pChain'

// X-Chain methods  
import { /* X-Chain methods */ } from '@avalanche-sdk/client/methods/xChain'

// C-Chain methods
import { /* C-Chain methods */ } from '@avalanche-sdk/client/methods/cChain'

// Wallet methods
import { /* Wallet methods */ } from '@avalanche-sdk/client/methods/wallet'

// Public methods
import { /* Public methods */ } from '@avalanche-sdk/client/methods/public'

// Admin methods
import { /* Admin methods */ } from '@avalanche-sdk/client/methods/admin'

// Info methods
import { /* Info methods */ } from '@avalanche-sdk/client/methods/info'

// Health methods
import { /* Health methods */ } from '@avalanche-sdk/client/methods/health'

// Index methods
import { /* Index methods */ } from '@avalanche-sdk/client/methods/index'
```

### Utilities

```typescript
import { 
  CB58ToHex,
  hexToCB58,
  getTxFromBytes,
  getUnsignedTxFromBytes,
  getUtxoFromBytes,
  getUtxosForAddress,
  // All viem utilities
  formatEther,
  parseEther,
  keccak256,
  // ... and many more
} from '@avalanche-sdk/client/utils'
```

### Additional Modules

```typescript
// Node utilities
import { /* Node utilities */ } from '@avalanche-sdk/client/node'

// Nonce management
import { /* Nonce utilities */ } from '@avalanche-sdk/client/nonce'

// Serializable utilities
import { /* Serializable utilities */ } from '@avalanche-sdk/client/serializable'

// SIWE (Sign-In with Ethereum)
import { /* SIWE utilities */ } from '@avalanche-sdk/client/siwe'

// Window utilities
import { /* Window utilities */ } from '@avalanche-sdk/client/window'
```

## Available Methods

### P-Chain Methods

- [`getBalance`](./src/methods/pChain/getBalance.ts) - Returns the balance of an address on the Platform Chain. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetbalance)
- [`getBlock`](./src/methods/pChain/getBlock.ts) - Gets a block by its ID. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetblock)
- [`getBlockByHeight`](./src/methods/pChain/getBlockByHeight.ts) - Gets a block by its height. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockbyheight)
- [`getBlockchainStatus`](./src/methods/pChain/getBlockchainStatus.ts) - Returns the status of a blockchain. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockchainstatus)
- [`getBlockchains`](./src/methods/pChain/getBlockchains.ts) - Returns all the blockchains that exist (excluding the P-Chain). [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockchains)
- [`getCurrentSupply`](./src/methods/pChain/getCurrentSupply.ts) - Returns the current supply of AVAX in the system. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetcurrentsupply)
- [`getCurrentValidators`](./src/methods/pChain/getCurrentValidators.ts) - Returns the current validators of the given Subnet. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetcurrentvalidators)
- [`getFeeConfig`](./src/methods/pChain/getFeeConfig.ts) - Returns the fee configuration for the P-Chain. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetfeeconfig)
- [`getFeeState`](./src/methods/pChain/getFeeState.ts) - Returns the current fee state of the P-Chain. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetfeestate)
- [`getHeight`](./src/methods/pChain/getHeight.ts) - Returns the height of the most recent block. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetheight)
- [`getL1Validator`](./src/methods/pChain/getL1Validator.ts) - Returns information about an L1 validator. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetl1validator)
- [`getMinStake`](./src/methods/pChain/getMinStake.ts) - Returns the minimum amount of nAVAX required to validate the requested Subnet. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetminstake)
- [`getProposedHeight`](./src/methods/pChain/getProposedHeight.ts) - Returns the proposed height of the most recent block. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetproposedheight)
- [`getRewardUTXOs`](./src/methods/pChain/getRewardUTXOs.ts) - Returns the reward UTXOs for a list of address:utxo_index pairs. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetrewardutxos)
- [`getStake`](./src/methods/pChain/getStake.ts) - Returns the amount of nAVAX staked by a set of addresses. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetstake)
- [`getStakingAssetID`](./src/methods/pChain/getStakingAssetID.ts) - Returns the assetID of the asset used for staking on the requested Subnet. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetstakingassetid)
- [`getSubnet`](./src/methods/pChain/getSubnet.ts) - Returns information about a Subnet. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetsubnet)
- [`getSubnets`](./src/methods/pChain/getSubnets.ts) - Returns all the blockchains that exist (excluding the P-Chain). [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetsubnets)
- [`getTimestamp`](./src/methods/pChain/getTimestamp.ts) - Returns the current timestamp of the P-Chain. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgettimestamp)
- [`getTotalStake`](./src/methods/pChain/getTotalStake.ts) - Returns the total amount staked on the requested Subnet. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgettotalstake)
- [`getTx`](./src/methods/pChain/getTx.ts) - Returns the specified transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgettx)
- [`getTxStatus`](./src/methods/pChain/getTxStatus.ts) - Returns the status of the specified transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgettxstatus)
- [`getUTXOs`](./src/methods/pChain/getUTXOs.ts) - Returns the UTXOs that reference a given address. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetutxos)
- [`getValidatorsAt`](./src/methods/pChain/getValidatorsAt.ts) - Returns the validators and their weights of a Subnet at the specified height. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformgetvalidatorsat)
- [`issueTx`](./src/methods/pChain/issueTx.ts) - Issues a transaction to the Platform Chain. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformissuetx)
- [`sampleValidators`](./src/methods/pChain/sampleValidators.ts) - Samples validators from the specified Subnet. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformsamplevalidators)
- [`validatedBy`](./src/methods/pChain/validatedBy.ts) - Gets the Subnet that validates a given blockchain. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformvalidatedby)
- [`validates`](./src/methods/pChain/validates.ts) - Gets the IDs of the blockchains a Subnet validates. [Docs](https://build.avax.network/docs/api-reference/p-chain/api#platformvalidates)

### X-Chain Methods

- [`buildGenesis`](./src/methods/xChain/buildGenesis.ts) - Builds a genesis block for the X-Chain. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmbuildgenesis)
- [`getAllBalances`](./src/methods/xChain/getAllBalances.ts) - Returns all balances for a given address. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgetallbalances)
- [`getAssetDescription`](./src/methods/xChain/getAssetDescription.ts) - Returns information about an asset. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgetassetdescription)
- [`getBalance`](./src/methods/xChain/getBalance.ts) - Returns the balance of an asset held by an address. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgetbalance)
- [`getBlock`](./src/methods/xChain/getBlock.ts) - Gets a block by its ID. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgetblock)
- [`getBlockByHeight`](./src/methods/xChain/getBlockByHeight.ts) - Gets a block by its height. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgetblockbyheight)
- [`getHeight`](./src/methods/xChain/getHeight.ts) - Returns the height of the most recent block. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgetheight)
- [`getTx`](./src/methods/xChain/getTx.ts) - Returns the specified transaction. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgettx)
- [`getTxFee`](./src/methods/xChain/getTxFee.ts) - Returns the fee for the specified transaction. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgettxfee)
- [`getTxStatus`](./src/methods/xChain/getTxStatus.ts) - Returns the status of the specified transaction. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgettxstatus)
- [`getUTXOs`](./src/methods/xChain/getUTXOs.ts) - Returns the UTXOs that reference a given address. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmgetutxos)
- [`issueTx`](./src/methods/xChain/issueTx.ts) - Issues a transaction to the X-Chain. [Docs](https://build.avax.network/docs/api-reference/x-chain/api#avmissuetx)

### C-Chain Methods

- [`getAtomicTx`](./src/methods/cChain/getAtomicTx.ts) - Returns the specified atomic transaction. [Docs](https://build.avax.network/docs/api-reference/c-chain/api#avaxgetatomictx)
- [`getAtomicTxStatus`](./src/methods/cChain/getAtomicTxStatus.ts) - Returns the status of the specified atomic transaction. [Docs](https://build.avax.network/docs/api-reference/c-chain/api#avaxgetatomictxstatus)
- [`getUTXOs`](./src/methods/cChain/getUTXOs.ts) - Returns the UTXOs that reference a given address. [Docs](https://build.avax.network/docs/api-reference/c-chain/api#avaxgetutxos)
- [`issueTx`](./src/methods/cChain/issueTx.ts) - Issues a transaction to the C-Chain. [Docs](https://build.avax.network/docs/api-reference/c-chain/api#avaxissuetx)

### Wallet Methods

- [`getAccountPubKey`](./src/methods/wallet/getAccountPubKey.ts) - Get the public key of the current account. [Docs](https://docs.core.app/docs/reference/avalanche_getaccountpubkey)
- [`send`](./src/methods/wallet/send.ts) - Send a transaction using the wallet. [Docs](https://docs.core.app/docs/reference/avalanche_sendtransaction)
- [`sendXPTransaction`](./src/methods/wallet/sendXPTransaction.ts) - Sign and Send a transaction on X-Chain or P-Chain. [Docs](https://docs.core.app/docs/reference/avalanche_sendtransaction)
- [`signXPMessage`](./src/methods/wallet/signXPMessage.ts) - Sign a message on X-Chain or P-Chain. [Docs](https://docs.core.app/docs/reference/avalanche_signmessage)
- [`signXPTransaction`](./src/methods/wallet/signXPTransaction.ts) - Sign a transaction on X-Chain or P-Chain. [Docs](https://docs.core.app/docs/reference/avalanche_signtransaction)
- [`waitForTxn`](./src/methods/wallet/waitForTxn.ts) - Wait for a transaction to be accepted. [Docs](https://docs.core.app/docs/reference/avalanche_sendtransaction)

### P-Chain Wallet Methods

- [`prepareAddPermissionlessDelegatorTx`](./src/methods/wallet/pChain/prepareAddPermissionlessDelegatorTxn.ts) - Prepare an add permissionless delegator transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-permissionless-delegator-tx)
- [`prepareAddPermissionlessValidatorTxn`](./src/methods/wallet/pChain/prepareAddPermissionlessValidatorTxn.ts) - Prepare an add permissionless validator transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-permissionless-validator-tx)
- [`prepareAddSubnetValidatorTxn`](./src/methods/wallet/pChain/prepareAddSubnetValidatorTxn.ts) - Prepare an add subnet validator transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-validator-tx)
- [`prepareBaseTxn`](./src/methods/wallet/pChain/prepareBaseTxn.ts) - Prepare a base transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-basetx)
- [`prepareConvertSubnetToL1Txn`](./src/methods/wallet/pChain/prepareConvertSubnetToL1Txn.ts) - Prepare a convert subnet to L1 transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-convert-subnet-to-l1-tx)
- [`prepareCreateChainTxn`](./src/methods/wallet/pChain/prepareCreateChainTxn.ts) - Prepare a create chain transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-create-chain-tx)
- [`prepareCreateSubnetTxn`](./src/methods/wallet/pChain/prepareCreateSubnetTxn.ts) - Prepare a create subnet transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-create-subnet-tx)
- [`prepareDisableL1ValidatorTxn`](./src/methods/wallet/pChain/prepareDisableL1ValidatorTxn.ts) - Prepare a disable L1 validator transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-disable-l1-validator-tx)
- [`prepareExportTxn`](./src/methods/wallet/pChain/prepareExportTxn.ts) - Prepare an export transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-export-tx)
- [`prepareImportTxn`](./src/methods/wallet/pChain/prepareImportTxn.ts) - Prepare an import transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-import-tx)
- [`prepareIncreaseL1ValidatorBalanceTxn`](./src/methods/wallet/pChain/prepareIncreaseL1ValidatorBalanceTxn.ts) - Prepare an increase L1 validator balance transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-increase-l1-validator-balance-tx)
- [`prepareRegisterL1ValidatorTxn`](./src/methods/wallet/pChain/prepareRegisterL1ValidatorTxn.ts) - Prepare a register L1 validator transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-register-l1-validator-tx)
- [`prepareRemoveSubnetValidatorTxn`](./src/methods/wallet/pChain/prepareRemoveSubnetValidatorTxn.ts) - Prepare a remove subnet validator transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-remove-validator-tx)
- [`prepareSetL1ValidatorWeightTxn`](./src/methods/wallet/pChain/prepareSetL1ValidatorWeightTxn.ts) - Prepare a set L1 validator weight transaction. [Docs](https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-set-l1-validator-weight-tx)

### X-Chain Wallet Methods

- [`prepareBaseTxn`](./src/methods/wallet/xChain/prepareBaseTxn.ts) - Prepare a base transaction for the X-Chain. [Docs](https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-basetx)
- [`prepareExportTxn`](./src/methods/wallet/xChain/prepareExportTxn.ts) - Prepare an export transaction for the X-Chain. [Docs](https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-export-tx)
- [`prepareImportTxn`](./src/methods/wallet/xChain/prepareImportTxn.ts) - Prepare an import transaction for the X-Chain. [Docs](https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-import-tx)

### C-Chain Wallet Methods

- [`prepareExportTxn`](./src/methods/wallet/cChain/prepareExportTxn.ts) - Prepare an export transaction from C-Chain to another chain. [Docs](https://build.avax.network/docs/api-reference/c-chain/txn-format#exporttx)
- [`prepareImportTxn`](./src/methods/wallet/cChain/prepareImportTxn.ts) - Prepare an import transaction from another chain to C-Chain. [Docs](https://build.avax.network/docs/api-reference/c-chain/txn-format#importtx)

### Public Methods

- [`baseFee`](./src/methods/public/baseFee.ts) - Returns the base fee for the next block. [Docs](https://build.avax.network/docs/api-reference/c-chain/api#eth_basefee)
- [`getChainConfig`](./src/methods/public/getChainConfig.ts) - Returns the chain configuration. [Docs](https://build.avax.network/docs/api-reference/subnet-evm-api#eth_getchainconfig)
- [`maxPriorityFeePerGas`](./src/methods/public/maxPriorityFeePerGas.ts) - Returns the maximum priority fee per gas. [Docs](https://build.avax.network/docs/api-reference/c-chain/api#eth_maxpriorityfeepergas)
- [`feeConfig`](./src/methods/public/feeConfig.ts) - Returns the fee configuration for the specified block. [Docs](https://build.avax.network/docs/api-reference/subnet-evm-api#eth_feeconfig)
- [`getActiveRulesAt`](./src/methods/public/getActiveRulesAt.ts) - Returns the active rules at the specified timestamp. [Docs](https://build.avax.network/docs/api-reference/subnet-evm-api#eth_getactiverulesat)

### Admin Methods

- [`alias`](./src/methods/admin/alias.ts) - Assign an API endpoint an alias. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminalias)
- [`aliasChain`](./src/methods/admin/aliasChain.ts) - Give a blockchain an alias. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminaliaschain)
- [`getChainAliases`](./src/methods/admin/getChainAliases.ts) - Returns the aliases of the chain. [Docs](https://build.avax.network/docs/api-reference/admin-api#admingetchainaliases)
- [`getLoggerLevel`](./src/methods/admin/getLoggerLevel.ts) - Returns log and display levels of loggers. [Docs](https://build.avax.network/docs/api-reference/admin-api#admingetloggerlevel)
- [`loadVMs`](./src/methods/admin/loadVMs.ts) - Dynamically loads any virtual machines installed on the node as plugins. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminloadvms)
- [`lockProfile`](./src/methods/admin/lockProfile.ts) - Writes a profile of mutex statistics to lock.profile. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminlockprofile)
- [`memoryProfile`](./src/methods/admin/memoryProfile.ts) - Writes a memory profile to mem.profile. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminmemoryprofile)
- [`setLoggerLevel`](./src/methods/admin/setLoggerLevel.ts) - Sets log and display levels of loggers. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminsetloggerlevel)
- [`startCPUProfiler`](./src/methods/admin/startCPUProfiler.ts) - Start profiling the CPU utilization of the node. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminstartcpuprofiler)
- [`stopCPUProfiler`](./src/methods/admin/stopCPUProfiler.ts) - Stop the CPU profile that was previously started. [Docs](https://build.avax.network/docs/api-reference/admin-api#adminstopcpuprofiler)

### Info Methods

- [`acps`](./src/methods/info/acps.ts) - Returns peer preferences for Avalanche Community Proposals (ACPs). [Docs](https://build.avax.network/docs/api-reference/info-api#infoacps)
- [`getBlockchainID`](./src/methods/info/getBlockchainID.ts) - Given a blockchain's alias, get its ID. [Docs](https://build.avax.network/docs/api-reference/info-api#infogetblockchainid)
- [`getNetworkID`](./src/methods/info/getNetworkID.ts) - Get the ID of the network this node is participating in. [Docs](https://build.avax.network/docs/api-reference/info-api#infogetnetworkid)
- [`getNetworkName`](./src/methods/info/getNetworkName.ts) - Get the name of the network this node is participating in. [Docs](https://build.avax.network/docs/api-reference/info-api#infogetnetworkname)
- [`getNodeID`](./src/methods/info/getNodeID.ts) - Get the ID, the BLS key, and the proof of possession of this node. [Docs](https://build.avax.network/docs/api-reference/info-api#infogetnodeid)
- [`getNodeIP`](./src/methods/info/getNodeIP.ts) - Get the IP of this node. [Docs](https://build.avax.network/docs/api-reference/info-api#infogetnodeip)
- [`getNodeVersion`](./src/methods/info/getNodeVersion.ts) - Get the version of this node. [Docs](https://build.avax.network/docs/api-reference/info-api#infogetnodeversion)
- [`getTxFee`](./src/methods/info/getTxFee.ts) - Get the transaction fee for the specified transaction type. [Docs](https://build.avax.network/docs/api-reference/info-api#infogettxfee)
- [`getVMs`](./src/methods/info/getVMs.ts) - Get the virtual machines supported by this node. [Docs](https://build.avax.network/docs/api-reference/info-api#infogetvms)
- [`isBootstrapped`](./src/methods/info/isBootstrapped.ts) - Check whether a given chain is done bootstrapping. [Docs](https://build.avax.network/docs/api-reference/info-api#infoisbootstrapped)
- [`peers`](./src/methods/info/peers.ts) - Get a description of peer connections. [Docs](https://build.avax.network/docs/api-reference/info-api#infopeers)
- [`uptime`](./src/methods/info/uptime.ts) - Returns the network's observed uptime of this node. [Docs](https://build.avax.network/docs/api-reference/info-api#infouptime)
- [`upgrades`](./src/methods/info/upgrades.ts) - Returns the upgrade history and configuration of the network. [Docs](https://build.avax.network/docs/api-reference/info-api#infoupgrades)

### Health Methods

- [`health`](./src/methods/health/health.ts) - Returns the last set of health check results. [Docs](https://build.avax.network/docs/api-reference/health-api#healthhealth)
- [`liveness`](./src/methods/health/liveness.ts) - Returns healthy once the endpoint is available. [Docs](https://build.avax.network/docs/api-reference/health-api#healthliveness)
- [`readiness`](./src/methods/health/readiness.ts) - Returns healthy once the node has finished initializing. [Docs](https://build.avax.network/docs/api-reference/health-api#healthreadiness)

### Index Methods

- [`getContainerByID`](./src/methods/index/getContainerByID.ts) - Get container by ID. [Docs](https://build.avax.network/docs/api-reference/index-api#indexgetcontainerbyid)
- [`getContainerByIndex`](./src/methods/index/getContainerByIndex.ts) - Get container by index. [Docs](https://build.avax.network/docs/api-reference/index-api#indexgetcontainerbyindex)
- [`getContainerRange`](./src/methods/index/getContainerRange.ts) - Get containers by index range. [Docs](https://build.avax.network/docs/api-reference/index-api#indexgetcontainerrange)
- [`getIndex`](./src/methods/index/getIndex.ts) - Get the index of a container. [Docs](https://build.avax.network/docs/api-reference/index-api#indexgetindex)
- [`getLastAccepted`](./src/methods/index/getLastAccepted.ts) - Get the last accepted container. [Docs](https://build.avax.network/docs/api-reference/index-api#indexgetlastaccepted)
- [`isAccepted`](./src/methods/index/isAccepted.ts) - Returns true if the container is in this index. [Docs](https://build.avax.network/docs/api-reference/index-api#indexisaccepted)

## Examples

Check out the [examples](./examples) folder for comprehensive usage examples:

### Basic Examples
- [`sendAvax.ts`](./examples/sendAvax.ts) - Basic example of sending AVAX using the SDK

### Primary Network Transaction Examples
The [`prepare-primary-network-txns`](./examples/prepare-primary-network-txns) folder contains examples for preparing various types of transactions:

#### Cross-Chain Transfer Examples
- [`transfer-avax-from-x-chain-to-p-chain.ts`](./examples/prepare-primary-network-txns/transfer-avax-from-x-chain-to-p-chain.ts) - Transfer AVAX from X-Chain to P-Chain
- [`transfer-avax-from-p-chain-to-x-chain.ts`](./examples/prepare-primary-network-txns/transfer-avax-from-p-chain-to-x-chain.ts) - Transfer AVAX from P-Chain to X-Chain
- [`transfer-avax-from-x-chain-to-c-chain.ts`](./examples/prepare-primary-network-txns/transfer-avax-from-x-chain-to-c-chain.ts) - Transfer AVAX from X-Chain to C-Chain
- [`transfer-avax-from-c-chain-to-x-chain.ts`](./examples/prepare-primary-network-txns/transfer-avax-from-c-chain-to-x-chain.ts) - Transfer AVAX from C-Chain to X-Chain
- [`transfer-avax-from-p-chain-to-c-chain.ts`](./examples/prepare-primary-network-txns/transfer-avax-from-p-chain-to-c-chain.ts) - Transfer AVAX from P-Chain to C-Chain
- [`transfer-avax-from-c-chain-to-p-chain.ts`](./examples/prepare-primary-network-txns/transfer-avax-from-c-chain-to-p-chain.ts) - Transfer AVAX from C-Chain to P-Chain

#### X-Chain Transaction Examples
- [`exportTx.ts`](./examples/prepare-primary-network-txns/x-chain/exportTx.ts) - Prepare X-Chain export transaction
- [`importTx.ts`](./examples/prepare-primary-network-txns/x-chain/importTx.ts) - Prepare X-Chain import transaction

#### P-Chain Transaction Examples
- [`addSubnetValidatorTx.ts`](./examples/prepare-primary-network-txns/p-chain/addSubnetValidatorTx.ts) - Add subnet validator transaction
- [`baseTx.ts`](./examples/prepare-primary-network-txns/p-chain/baseTx.ts) - Base transaction example
- [`convertSubnetToL1Tx.ts`](./examples/prepare-primary-network-txns/p-chain/convertSubnetToL1Tx.ts) - Convert subnet to L1 transaction
- [`createChainTx.ts`](./examples/prepare-primary-network-txns/p-chain/createChainTx.ts) - Create chain transaction
- [`createSubnetTx.ts`](./examples/prepare-primary-network-txns/p-chain/createSubnetTx.ts) - Create subnet transaction
- [`exportTx.ts`](./examples/prepare-primary-network-txns/p-chain/exportTx.ts) - Prepare P-Chain export transaction
- [`importTx.ts`](./examples/prepare-primary-network-txns/p-chain/importTx.ts) - Prepare P-Chain import transaction
- [`removeSubnetValidatorTx.ts`](./examples/prepare-primary-network-txns/p-chain/removeSubnetValidatorTx.ts) - Remove subnet validator transaction

#### C-Chain Transaction Examples
- [`exportTx.ts`](./examples/prepare-primary-network-txns/c-chain/exportTx.ts) - Prepare C-Chain export transaction
- [`importTx.ts`](./examples/prepare-primary-network-txns/c-chain/importTx.ts) - Prepare C-Chain import transaction

For more detailed information about each example, see the [examples README](./examples/README.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [documentation](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/client#readme)
2. Open an [issue](https://github.com/ava-labs/avalanche-sdk-typescript/issues)
3. Join our community channels for help

## Links

- [GitHub Repository](https://github.com/ava-labs/avalanche-sdk-typescript)
- [Documentation](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/client#readme)
- [Issue Tracker](https://github.com/ava-labs/avalanche-sdk-typescript/issues)