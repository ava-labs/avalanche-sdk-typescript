# Interchain

Interchain Messaging (ICM) made simple for Avalanche Subnet ecosystems.

The `@avalanche-sdk/interchain` package provides a developer-friendly TypeScript SDK to send and manage cross-chain messages between Avalanche and its subnets using the Interchain Messaging (ICM) protocol.

## Features

- Type-safe ICM client for sending cross-chain messages
- Works seamlessly with [`viem`](https://viem.sh/) wallet clients
- Built-in support for Avalanche C-Chain and custom subnets

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.0.0

## Installation

```bash
npm install @avalanche-sdk/interchain viem
```

## Sending Messages Cross-Chain

Here’s a minimal example demonstrating how to send a cross-chain message using `createICMClient`:

```ts
import { createWalletClient, http } from "viem";
import { createICMClient } from "@avalanche-sdk/interchain";
import { privateKeyToAccount } from "viem/accounts";

// these will be made available in a separate SDK soon
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

// Load your signer/account
const account = privateKeyToAccount('0x63e0730edea86f6e9e95db48dbcab18406e60bebae45ad33e099f09d21450ebf');

// Create a viem wallet client connected to Avalanche Fuji
const wallet = createWalletClient({
  transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
  account,
});

// Initialize the ICM client
const icmClient = createICMClient(wallet);

// Send a message across chains
async function main() {
  const hash = await icmClient.sendMsg({
    sourceChain: avalancheFuji,
    destinationChain: dispatch,
    message: 'Hello from Avalanche Fuji to Dispatch Fuji!',
  });
  console.log('Message sent with hash:', hash);
}

main();
```

## Sending Tokens Cross-Chain

Sending ERC20 tokens from one Avalanche L1 to another is possible using Teleporter.
Before sending tokens, we need to setup some contracts on both source and destination chains. Here's a quick summary of steps we'd need to follow:

- Deploy ERC20 Token.
- Deploy `TokenHome` contract on the source chain.
- Deploy `TokenRemote` contract on the destination chain.
- Register `TokenRemote` on `TokenHome` by issuing a transaction on `TokenRemote` contract, which in turn will emit an event on the source chain.
- Approve `TokenHome` contract to spend (and hence lock) ERC20 tokens.
- Send ERC20 Token from source to destination chain.

Here's a demo to do that with the Interchain SDK.

```typescript
import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createICTTClient } from "@avalanche-sdk/interchain";

// These will be made available in separate SDK
import { avalancheFuji, dispatch } from "@avalanche-sdk/interchain/chains";

const account = privateKeyToAccount('0x63e0730edea86f6e9e95db48dbcab18406e60bebae45ad33e099f09d21450ebf');

// We need separate wallet clients for each to do certain operations
const fujiWallet = createWalletClient({
    chain: avalancheFuji,
    transport: http(),
    account,
})
const dispatchWallet = createWalletClient({
    chain: dispatch,
    transport: http(),
    account,
})

// We can create ICTT client with or without default source/destination chains
const ictt = createICTTClient();

async function main() {
    // Deploy ERC20 token on Avalanche Fuji
    const { contractAddress: tokenAddress } = await ictt.deployERC20Token({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        name: 'Test Token',
        symbol: 'TEST',
        initialSupply: 1000000,
    });
    console.log(`Token deployed on Avalanche Fuji: ${tokenAddress}`);

    // Deploy Token Home Contract on Avalanche Fuji. This is one-time process for each token we
    // want to send to another chain.
    const { contractAddress: tokenHomeContract } = await ictt.deployTokenHomeContract({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        erc20TokenAddress: tokenAddress,
        minimumTeleporterVersion: 1,
    });
    console.log(`Token home contract deployed on Avalanche Fuji: ${tokenHomeContract}`);

    // Deploy Token Remote Contract on Dispatch. This is one-time process for each token we
    // want to send to another chain.
    const { contractAddress: tokenRemoteContract } = await ictt.deployTokenRemoteContract({
        walletClient: dispatchWallet,
        sourceChain: avalancheFuji,
        destinationChain: dispatch,
        tokenHomeContract,
    });
    console.log(`Token remote contract deployed on Dispatch: ${tokenRemoteContract}`);

    // Register Token Remote Contract with Token Home Contract on Dispatch. This is one-time process for each token we
    // want to send to another chain.
    const { txHash: registerRemoteWithHomeTxHash } = await ictt.registerRemoteWithHome({
        walletClient: dispatchWallet,
        sourceChain: avalancheFuji,
        destinationChain: dispatch,
        tokenRemoteContract,
    })
    console.log(`Token remote contract registered with home on Dispatch: ${registerRemoteWithHomeTxHash}`);

    // Approve token on Avalanche Fuji. This operation approves the HomeContract to
    // lock token on Fuji as collateral for the interchain transfer.
    const { txHash: approveTokenTxHash } = await ictt.approveToken({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        tokenHomeContract,
        tokenAddress,
        amountInBaseUnit: 2,
    })
    console.log(`Token approved on Avalanche Fuji: ${approveTokenTxHash}`);

    // Send token from Avalanche Fuji to Dispatch.
    const { txHash: sendTokenTxHash } = await ictt.sendToken({
        walletClient: fujiWallet,
        sourceChain: avalancheFuji,
        destinationChain: dispatch,
        tokenHomeContract,
        tokenRemoteContract,
        amountInBaseUnit: 1,
        recipient: '0x909d71Ed4090ac6e57E3645dcF2042f8c6548664',
    })
    console.log(`Token sent from Avalanche Fuji to Dispatch: ${sendTokenTxHash}`);
}

main().catch(console.error);
```