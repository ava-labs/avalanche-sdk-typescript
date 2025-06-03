<div align="center">
    <h1>Avalanche SDK TypeScript Suite</h1>
    <p>
        A comprehensive suite of TypeScript SDKs for interacting with Avalanche's blockchain services and APIs.
    </p>
    <a href="https://developers.avacloud.io">
        <img src="https://img.shields.io/static/v1?label=Docs&message=API Ref&color=3b6ef9&style=for-the-badge" />
    </a>
    <a href="https://github.com/ava-labs/avalanche-sdk-typescript/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/ava-labs/avalanche-sdk-typescript?style=for-the-badge" />
    </a>
</div>

## Overview

This repository contains a suite of TypeScript SDKs designed to simplify integration with Avalanche's blockchain services. Each SDK is focused on specific functionality, allowing developers to use only what they need while maintaining a consistent interface and development experience.

## Available SDKs

- **[@avalanche-sdk/data](packages/data/README.md)**       
  - Focused SDK for accessing Avalanche's Data API
  - Provides real-time and historical blockchain data
  - [Installation &amp; Usage](packages/data/README.md#installation)

- **[@avalanche-sdk/metrics](packages/metrics/README.md)**
  - Dedicated SDK for accessing blockchain metrics and analytics
  - [Installation &amp; Usage](packages/metrics/README.md#installation)

- **[@avalanche-sdk/webhooks](packages/webhooks/README.md)** 
  - SDK for managing webhooks and real-time event notifications
  - [Installation &amp; Usage](packages/webhooks/README.md#installation)

- **[@avalanche-sdk/devtools](packages/devtools/README.md)** 
  - Development utilities and tools for building Avalanche applications
  - [Installation &amp; Usage](packages/devtools/README.md#installation)

- **[@avalanche-sdk/primary-network](packages/primary-network/README.md)** 
  - SDK for interacting with Avalanche's Primary Network
  - Includes P-Chain, X-Chain, and C-Chain operations
  - [Installation &amp; Usage](packages/primary-network/README.md#installation)

- **[@avalanche-sdk/rpc](packages/rpc/README.md)** 
  - Low-level SDK for direct RPC communication with Avalanche nodes
  - [Installation &amp; Usage](packages/rpc/README.md#installation)

## Installation

Each SDK in this suite can be installed independently. For detailed installation instructions and specific version requirements, please refer to each SDK's README:

- [SDK Installation Guide](sdk/README.md#sdk-installation)
- [Data SDK Installation Guide](packages/data/README.md#installation)
- [Metrics SDK Installation Guide](packages/metrics/README.md#installation)
- [Webhooks SDK Installation Guide](packages/webhooks/README.md#installation)
- [Primary Network SDK Installation Guide](packages/primary-network/README.md#installation)
- [RPC SDK Installation Guide](packages/rpc/README.md#installation)
- [DevTools Installation Guide](packages/devtools/README.md#installation)

For installing the unified sdk:

```bash
# Using npm
npm install @avalanche-sdk/sdk  

# Using yarn
yarn add @avalanche-sdk/sdk         

# Using pnpm
pnpm add @avalanche-sdk/sdk 
# Using bun
bun add @avalanche-sdk/sdk 
```

## Quick Start

```typescript
import { Avalanche } from "@avalanche-sdk/sdk";

const avalanche = new Avalanche({
  apiKey: "<YOUR_API_KEY>",
  chainId: "43114", // Mainnet
  network: "mainnet",
});

async function main() {
  // Get latest blocks across all chains
  const blocks = await avalanche.data.evm.blocks.listLatestAllChains();
  
  // Monitor address activity
  const webhook = await avalanche.webhooks.create({
    eventType: "address_activity",
    url: "https://your-webhook-url.com",
    metadata: {
      addresses: ["0x..."],
    },
  });
}

main().catch(console.error);
```

## Features

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modular Design**: Use only the SDKs you need
- **Consistent Interface**: Common patterns and interfaces across all SDKs
- **Production Ready**: Built-in support for:
  - Error handling and retries
  - Pagination
  - Rate limiting
  - Request validation
  - Custom HTTP clients
  - Debug logging
- **Documentation**: Comprehensive API documentation and examples

## Support

- [Documentation](https://developers.avacloud.io)
- [GitHub Issues](https://github.com/ava-labs/avalanche-sdk-typescript/issues)
- [Discord Community](https://chat.avax.network)

## License

This project is licensed under the [MIT License](LICENSE).
