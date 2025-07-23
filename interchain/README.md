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

## Quickstart

Here’s a minimal example demonstrating how to send a cross-chain message using `createICMClient`:

```ts
import { createWalletClient, http } from "viem";
import { createICMClient } from "@avalanche-sdk/interchain";
import { privateKeyToAccount } from "viem/accounts";

// these will be made available in a separate SDK soon
import { avalancheFuji } from "./chains/avalancheFuji";
import { dispatch } from "./chains/dispatch";

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
