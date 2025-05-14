# Avalanche SDK Primary Network

A Typescript SDK for building transactions and interacting with the Avalanche Primary Network (P-Chain and X-Chain). It offers an interface for creating, signing, and issuing various types of transactions on the Avalanche network.

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0.0

## Installation

```bash
npm install @avalanche-sdk/primary-network
# or
yarn add @avalanche-sdk/primary-network
# or
pnpm add @avalanche-sdk/primary-network
```

## Transaction Building

The SDK provides a structured way to build different types of transactions. Here's a comprehensive guide on how to build transactions.

### Quickstart

Most of the code will require these boilerplate instantiations

```typescript
import { createPrimaryNetworkClient, Wallet } from "@avalanche-sdk/primary-network";

export function fetchInstantiatedClients() {
    const pnClient = createPrimaryNetworkClient({
        nodeUrlOrChain: "fuji",
    });

    // links private keys for signing transaction
    // linking private key is optional, and is required only when we want to sign transactions,
    // or fetch input UTXOs for building transactions
    pnClient.linkPrivateKeys(["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"]) // this is a common ewoq address used for testing

    return { pnClient, wallet }
}
```

### P-Chain BaseTx

Let's try to build a simple `BaseTx` that will transfer funds from one address to another on P-Chain.

```typescript
const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
});

async function main() {
    pnClient.linkPrivateKeys(["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"]) 

    const baseTx = await pnClient.pChain.newBaseTx({
        // outputs consists of the receiver info
        outputs: [
            {
                addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
                amount: 0.00001,
            }
        ],
    })

    await baseTx.sign()
    baseTx.issue().then(console.log)
}
main()
```

### Building Transactions from Bytes

Using the SDK, we can also build structured transaction objects from the signed or unsigned transaction bytes (hex).

```typescript
    const pnClient = createPrimaryNetworkClient({
        nodeUrlOrChain: "fuji",
    });

    const txHexBytes = '<HEX_TX_BYTES>'

    const addPermissionlessDelegatorTx = pnClient.pChain.newTxFromBytes(txHexBytes, txTypes.pChain.AddPermissionlessDelegatorTx)

    console.log(addPermissionlessDelegatorTx.tx.getDelegatorRewardsOwner())
```

### Other Examples

There are other [examples](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/primary-network/examples) as well for building, signing, and issuing P-Chain transactions.

- `addSubnetValidatorTx.ts` - Adding a validator to a subnet
- `createChainTx.ts` - Creating a new blockchain
- `createSubnetTx.ts` - Creating a new subnet
- `increaseL1ValidatorBalanceTx.ts` - Increasing L1 validator balance
- `removeSubnetValidatorTx.ts` - Removing a validator from a subnet
- `exportTx.ts` - Exporting assets from P-Chain
- `importTx.ts` - Importing assets to P-Chain

### Import Transaction Builders

Import the specific transaction builders directly without bundling them with other transaction types. You can do that using the `PrimaryNetworkCoreClient`. See example below.

```typescript
import { createPrimaryNetworkCoreClient, Wallet } from "@avalanche-sdk/primary-network";
import { newBaseTx } from '@avalanche-sdk/primary-network/dist/transactions/p-chain'

async function main() {
    const wallet = new Wallet({
        nodeUrl: "https://api.avax-test.network",
        privateKeys: ["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"], // common ewoq address for testing
    });

    const pnClient = createPrimaryNetworkCoreClient({
        nodeUrlOrChain: "fuji",
        wallet,
    });

    const baseTx = await newBaseTx(
        pnClient,
        {
            outputs: [
                {
                addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
                amount: 0.00001,
            }
        ],
    })

    await baseTx.sign()
    baseTx.issue().then(console.log)
}
main()
```

### Structured Transaction Data

The transaction class returned when creating different types of transactions provides various transaction-specific `getter` functions.
These `getter` functions are mostly in the `tx` property of the transaction. Here's an example:

```typescript
const delegatorTx = await pnClient.pChain.newAddPermissionlessDelegatorTx(params)

// returns delegator's reward owners
delegator.tx.getDelegatorRewardsOwner()

// returns stake info
delegator.tx.stake

// returns any credentials if the tx is signed
delegator.unsignedTx.getCredentials()
```
