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

The SDK provides a structured way to build different types of transactions. Currently this SDK supports all P-Chain transaction types and C-Chain atomic transactions (ExportTx and ImportTx) Here's a comprehensive guide on how to build transactions.

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
    console.log(await baseTx.issue())
}
main()
```

There are other [examples](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/primary-network/examples/p-chain) as well for building, signing, and issuing P-Chain transactions.

- `addSubnetValidatorTx.ts` - Adding a validator to a subnet
- `createChainTx.ts` - Creating a new blockchain
- `createSubnetTx.ts` - Creating a new subnet
- `increaseL1ValidatorBalanceTx.ts` - Increasing L1 validator balance
- `removeSubnetValidatorTx.ts` - Removing a validator from a subnet
- `exportTx.ts` - Exporting assets from P-Chain
- `importTx.ts` - Importing assets to P-Chain

### C-Chain Atomic Transactions

Let's try to build an ExportTx on the C-Chain, which will export AVAX to the P-Chain.

```typescript
const pnClient = createPrimaryNetworkClient({
    nodeUrlOrChain: "fuji",
});

async function main() {
    pnClient.linkPrivateKeys(["56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"]) 

    // C-Chain to Atomic Memory (not yet on desitnation chain)
    const exportTx = await pnClient.cChain.newExportTx({
        destinationChain: 'P',
        fromAddress: '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
        exportedOutput: {
            addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
            amountInAvax: 0.1,
        }
    })
    await exportTx.sign()
    console.log(await exportTx.issue())

    // Atomic Memory to P-Chain (this will import all exported outputs)
    const importTx = await pnClient.pChain.newImportTx({
        sourceChain: 'C',
        importedOutput: {
            addresses: ['P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t'],
        },
    })
    await importTx.sign()
    console.log(await importTx.issue())
}
main()
```

There are other [examples](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/primary-network/examples/c-chain) to build, sign, and issue C-Chain atomic transactions.

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

### Import Transaction Builders

Import the specific transaction builders directly without bundling them with other transaction types. You can do that using the `PrimaryNetworkCoreClient`. See example below.

```typescript
import { createPrimaryNetworkCoreClient, Wallet } from "@avalanche-sdk/primary-network";
import { newBaseTx } from '@avalanche-sdk/primary-network/transactions/pchain'

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
    console.log(await baseTx.issue())
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

## Warp Message Parsing

The SDK provides utilities for parsing and working with Warp messages, which are used for cross-chain communication in the Avalanche network. Warp messages are signed messages that can be verified across different chains.

### Message Structure

A Warp message consists of several components:
- Network ID
- Source Chain ID
- Addressed Call Payload
  - Source Address
  - Message Payload (specific to the message type)
- BitSet Signatures

For more details on the format, refer to original [AvalancheGo docs](https://github.com/ava-labs/avalanchego/blob/ae36212/vms/platformvm/warp/README.md)

### Supported Message Types

The SDK currently supports parsing the following types of AddressedCall payload messages:

1. **RegisterL1ValidatorMessage**
2. **L1ValidatorWeightMessage**
3. **L1ValidatorRegistrationMessage**
4. **SubnetToL1ConversionMessage**

For more details on the format of message types, refer to original [ACP 77](https://github.com/avalanche-foundation/ACPs/blob/58c78c/ACPs/77-reinventing-subnets/README.md#p-chain-warp-message-payloads)

### Working with Warp Messages

You can parse Warp messages from their hex representation and access their components. The SDK provides type-safe methods to work with different message types.

For detailed examples of working with Warp messages, see the [warp examples directory](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/primary-network/examples/warp).

### Example Usage

Message types and related builder functions can imported from `/warp` sub-path as shown below.

```typescript
import { WarpMessage, RegisterL1ValidatorMessage } from "@avalanche-sdk/primary-network/warp";

const signedWarpMsgHex = '<SIGNED_MSG_HEX>'

// Parse a signed Warp message
const signedWarpMsg = WarpMessage.fromHex(signedWarpMsgHex);

// Parse message from signed message, or AddressedCall payload, or the actual message
const registerL1ValidatorMsg = RegisterL1ValidatorMessage.fromHex(signedWarpMsgHex);

// Convert back to hex
const hexBytes = registerL1ValidatorMsg.toHex();
```

### Building Unsigned Messages

You can also build the unsigned messages like `RegisterL1ValidatorMessage` or `L1ValidatorWeightMessage`.

```typescript
import {
    AddressedCall,
    L1ValidatorWeightMessage,
    WarpUnsignedMessage
} from "@avalanche-sdk/primary-network/warp";

// building the L1ValidatorWeight message using values
const newL1ValidatorWeightMsg = L1ValidatorWeightMessage.fromValues(
    '251q44yFiimeVSHaQbBk69TzoeYqKu9VagGtLVqo92LphUxjmR',
    4n,
    41n,
)

// building AddressedCall payload from the above message
const addressedCallPayload = AddressedCall.fromValues(
    '0x35F884853114D298D7aA8607f4e7e0DB52205f07',
    newL1ValidatorWeightMsg.toHex()
)

// building WarpUnsignedMessage from the above addressed call payload
const warpUnsignedMessage = WarpUnsignedMessage.fromValues(
    1,
    '251q44yFiimeVSHaQbBk69TzoeYqKu9VagGtLVqo92LphUxjmR',
    addressedCallPayload.toHex()
)
```

For more detailed examples and use cases, refer to the [warp examples](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/primary-network/examples/warp) in the repository.


