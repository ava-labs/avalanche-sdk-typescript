# Avalanche SDK RPC

A TypeScript SDK for interacting with the Avalanche network through JSON-RPC APIs. This SDK provides a comprehensive set of tools to interact with all Avalanche chains (P-Chain, X-Chain, C-Chain) and various APIs.

## Installation

```bash
npm install @avalanche-sdk/rpc
# or
yarn add @avalanche-sdk/rpc
# or
pnpm add @avalanche-sdk/rpc
```

## Quick Start

```typescript
import { createAvalancheClient } from '@avalanche-sdk/rpc'
import { avalanche } from '@avalanche-sdk/rpc/chains'

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

## Features

- **Multi-Chain Support**: Interact with all Avalanche chains:
  - P-Chain (Platform Chain)
  - X-Chain (Exchange Chain)
  - C-Chain (Contract Chain)
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

## Configuration

The SDK can be configured with various options:

```typescript
const client = createAvalancheClient({
  chain: avalanche, // Chain configuration
  transport: {
    type: "http", // Transport type
    url: "<url>",
  },
  apiKey: "", // Optional API key
  rlToken: "", // Optional rate limit token
})
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [documentation](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/rpc#readme)
2. Open an [issue](https://github.com/ava-labs/avalanche-sdk-typescript/issues)
3. Join our community channels for help

## Links

- [GitHub Repository](https://github.com/ava-labs/avalanche-sdk-typescript)
- [Documentation](https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/rpc#readme)
- [Issue Tracker](https://github.com/ava-labs/avalanche-sdk-typescript/issues)
