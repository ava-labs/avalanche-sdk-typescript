
<div align="center">
  <h1>Avalanche SDK Typescript</h1>
  <h3>The official TypeScript SDK suite for building on Avalanche</h3>

  <p align="center">
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
    </a>
    <a href="https://nodejs.org">
      <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen" alt="Node Version" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0%2B-blue" alt="TypeScript" />
    </a>
  </p>
</div>

## Overview

Avalanche SDK TypeScript provides a complete set of tools and libraries for developers to interact with the Avalanche blockchain ecosystem. This monorepo includes multiple specialized SDKs, each designed for specific use cases while maintaining consistency and interoperability.

> ⚠️ **Developer Preview**: This suite of SDKs is currently in beta and is subject to change. Use in production at your own risk.

### 🎯 Which SDK Should I Use?
 
 
## Available SDKs

### [Client SDK](./client/)
The main Avalanche client SDK for interacting with Avalanche nodes and building blockchain applications.

**Features:**
- Complete API coverage for P-Chain, X-Chain, and C-Chain
- Full [viem](https://viem.sh) compatibility - anything you can do with viem works here
- TypeScript-first design with full type safety
- Abstractions over the JSON-RPC API to make your life easier
- Wallet integration and transaction management
- First-class APIs for interacting with Smart Contracts
- Retrieve balances and UTXOs for addresses
- Build, sign, and issue transactions to any chain
- Perform cross-chain transfers between X, P and C chains
- Add validators and delegators
- Create subnets and blockchains, convert subnets to L1s


### [Data SDK](./data/)
SDK for accessing and analyzing Avalanche blockchain data.

**Features:**
- Retrieve transaction and UTXO details from the Primary Network (P/X/C-Chain) and Avalanche L1s
- Get latest blocks and detailed block information
- Fetch native, ERC-20, ERC-721, and ERC-1155 token balances with metadata
- Token Reputation Analysis for ERC-20 tokens to identify security risks (benign, malicious, or unknown)
- Augment user experience with comprehensive token and asset details
- Access active and historical validator staking information
- Real-time blockchain analytics and historical data
SDK for collecting and analyzing Avalanche network metrics.

 

### [Interchain SDK](./interchain/)
SDK for building cross-L1 applications and bridges.

**Features:**
- Type-safe ICM client for sending cross-chain messages
- Works seamlessly with wallet clients
- Built-in support for Avalanche C-Chain and custom subnets

 
**Features:**
- Network performance metrics
- Validator statistics
- Transaction analytics
- Network health monitoring
- Performance benchmarking

### [Webhooks SDK](./webhooks/)
SDK for handling real-time blockchain events and notifications.

**Features:**
- Real-time event streaming
- Webhook management
- Event filtering and routing
- Notification systems
- Automated response handling

### [Unified SDK](./sdk/)
SDK providing a unified experience of all the SDKs

**Features:**
- **Complete API Coverage** - All P-Chain, X-Chain, and C-Chain APIs from Client SDK
- **Data Analytics** - Historical transaction data and blockchain analytics from Data SDK
- **Development Tools** - Testing frameworks, debugging tools, and utilities from DevTools SDK
- **Cross-Chain Operations** - Interchain communication and bridge functionality from Interchain SDK
- **Network Metrics** - Performance monitoring and validator statistics from Metrics SDK
- **Real-Time Events** - Webhook management and event streaming from Webhooks SDK
- **Type-Safe Design** - Full TypeScript support across all functionality
- **Modular Architecture** - Import only the features you need
- **Comprehensive Examples** - Complete examples for all use cases

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, or pnpm
- TypeScript 5.0+ (recommended)

### Installation

#### Option 1: Install the Unified SDK (Recommended)
```bash
# npm
npm install @avalanche-sdk/sdk

# yarn
yarn add @avalanche-sdk/sdk

# pnpm
pnpm add @avalanche-sdk/sdk
```

#### Option 2: Install Individual SDKs
```bash
# Install only what you need
npm install @avalanche-sdk/client        # Core RPC functionality
npm install @avalanche-sdk/data          # Data analytics
npm install @avalanche-sdk/interchain    # Cross-chain messaging
npm install @avalanche-sdk/metrics       # Network metrics
npm install @avalanche-sdk/webhooks      # Real-time events
npm install @avalanche-sdk/devtools      # Development tools
```

### Quick Examples

#### 🔗 Basic Client Usage
```typescript
import { createAvalancheClient } from '@avalanche-sdk/client'
import { avalanche } from '@avalanche-sdk/client/chains'

const client = createAvalancheClient({
  chain: avalanche,
  transport: {
    type: "http"
  }
})


// Get account balance
const balance = await client.getBalance({ 
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

[![Try it out](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/helius-node-js-sdk-xbw7t6?file=index.js)

#### 📊 Data Analytics
```typescript
import { AvaCloudSDK } from '@avalanche-sdk/data'

const avaCloudSDK = new AvaCloudSDK({
  apiKey: '<YOUR_API_KEY_HERE>',
  chainId: '43114',
  network: 'mainnet',
})

// Get transaction history
const transactions = await avaCloudSDK.data.evm.transactions.getTransactionsByAddress({
  address: '0x...',
  pageSize: 10
})
```

#### 🌉 Cross-Chain Messaging
```typescript
import { createICMClient } from '@avalanche-sdk/interchain'

const icmClient = createICMClient({
  sourceChain: avalanche,
  destinationChain: customSubnet,
})

// Send cross-chain message
await icmClient.sendMessage({
  message: 'Hello from C-Chain!',
  destinationAddress: '0x...'
})
```

## 💡 What You Can Build

### Blockchain Infrastructure
- Custom RPC endpoints and API gateways
- Transaction broadcasting services
- Multi-chain wallet backends
- Account management systems

### Data Analytics & Monitoring
- Portfolio tracking applications
- Transaction history explorers
- Token balance dashboards
- Network health monitoring tools
- Validator performance trackers

### Real-Time Applications
- Price alert systems
- Transaction notification services
- Smart contract event monitors
- Blockchain activity feeds

### Cross-Chain Communication
- ICM message relayers
- Cross-L1 notification systems
- Interchain data synchronization
- Multi-chain coordination tools

### Developer Tools
- Smart contract debugging interfaces
- Transaction simulation tools
- Network testing utilities
- Blockchain data indexers

## Documentation

Each SDK includes comprehensive documentation:

- **[Client SDK Documentation](./client/README.md)** - Complete API reference and usage examples
- **[Data SDK Documentation](./data/README.md)** - Data access and analytics guide
- **[DevTools SDK Documentation](./devtools/README.md)** - Development utilities guide
- **[Interchain SDK Documentation](./interchain/README.md)** - Cross-chain development guide
- **[Metrics SDK Documentation](./metrics/README.md)** - Metrics and monitoring guide
- **[SDK Documentation](./sdk/README.md)** - Unified SDK
- **[Webhooks SDK Documentation](./webhooks/README.md)** - Real-time events guide

## Examples

Each SDK includes practical examples demonstrating common use cases:

- **Client SDK Examples** - [View Examples](./client/examples/)
- **Data SDK Examples** - [View Examples](./data/examples/)
- **DevTools SDK Examples** - [View Examples](./devtools/examples/)
- **Interchain SDK Examples** - [View Examples](./interchain/examples/)
- **Metrics SDK Examples** - [View Examples](./metrics/examples/)
- **Core SDK Examples** - [View Examples](./sdk/examples/)
- **Webhooks SDK Examples** - [View Examples](./webhooks/examples/)

## Architecture

The Avalanche SDK TypeScript suite is designed with modularity in mind:

```
avalanche-sdk-typescript/
├── client/          # Main client SDK
├── data/            # Data access SDK
├── devtools/        # Development tools
├── interchain/      # Cross-chain SDK
├── metrics/         # Metrics and monitoring
├── sdk/             # Unified SDK
└── webhooks/        # Real-time events
```

Each SDK is:
- **Independent** - Can be used standalone
- **Modular** - Import only what you need
- **Type-safe** - Full TypeScript support
- **Well-documented** - Comprehensive guides and examples

## ⚡ Performance & Best Practices

### Optimization Tips
- Use the unified SDK for better tree-shaking when using multiple features
- Enable request batching for bulk operations
- Implement proper error handling and retries
- Cache frequently accessed data
- Use WebSocket connections for real-time data

### Security Considerations
- Never expose private keys in client-side code
- Use environment variables for sensitive data
- Validate all inputs before blockchain interactions
- Implement proper access controls
- Follow [security best practices](https://docs.avax.network/build/references/security)

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Module not found` errors | Ensure you're using Node.js 20+ and have installed dependencies |
| TypeScript errors | Update to TypeScript 5.0+ and check `tsconfig.json` |
| Connection timeouts | Check network settings and RPC endpoint availability |
| Transaction failures | Verify gas settings and account balance |
| Type mismatches | Ensure all SDKs are on compatible versions |


## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors
```bash
# Clone the repository
git clone https://github.com/ava-labs/avalanche-sdk-typescript.git
cd avalanche-sdk-typescript

# Move to the SDK directory you want to work on
cd client

# Install dependencies
npm install

# Run tests
npm test

# Build all packages
npm run build
```

### Looking for Good First Issues?
Check out our [good first issues](https://github.com/ava-labs/avalanche-sdk-typescript/labels/good%20first%20issue) to get started!

## 📞 Support

### 📖 Documentation & Resources
- [API Reference](https://build.avax.network/docs/api-reference)
- [Developer Docs](https://docs.avax.network)
- [Video Tutorials](https://www.youtube.com/Avalancheavax)
- [Code Examples](./examples)

### 👥 Community & Help
- [Discord](https://discord.gg/avax) - Get real-time help
- [Telegram](https://t.me/+KDajA4iToKY2ZjBk) - Join discussions
- [Twitter](https://x.com/AvaxDevelopers) - Stay updated

### 🐛 Issue Tracking
- [Report a Bug](https://github.com/ava-labs/avalanche-sdk-typescript/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/ava-labs/avalanche-sdk-typescript/issues/new?template=feature_request.md)
- [View All Issues](https://github.com/ava-labs/avalanche-sdk-typescript/issues)

### 📮 Direct Support
- Technical Issues: [GitHub Issues](https://github.com/ava-labs/avalanche-sdk-typescript/issues)
- Security Issues: security@avalabs.org
- General Inquiries: data-platform@avalabs.org

## 🔄 Release Notes

See [CHANGELOG.md](CHANGELOG.md) for a detailed version history.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <h3>🏔️ Built with ❤️ by the Avalanche Team</h3>
  
  [Website](https://www.avax.network/) • 
  [Documentation](https://docs.avax.network/) • 
  [Blog](https://medium.com/@avaxdevelopers) • 
  [GitHub](https://github.com/ava-labs)
</div>
