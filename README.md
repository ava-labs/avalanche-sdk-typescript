# Avalanche SDK TypeScript

This repository contains Avalanche's comprehensive suite of TypeScript SDKs for building applications on the Avalanche network.

## Overview

Avalanche SDK TypeScript provides a complete set of tools and libraries for developers to interact with the Avalanche blockchain ecosystem. The repository includes multiple specialized SDKs, each designed for specific use cases and functionality.

## Available SDKs

### [Client SDK](./client/)
The main Avalanche client SDK for interacting with Avalanche nodes and building blockchain applications.

**Features:**
- Complete API coverage for P-Chain, X-Chain, and C-Chain
- Wallet integration and transaction management
- Cross-chain transfer capabilities
- Comprehensive method coverage for all Avalanche APIs
- TypeScript-first design with full type safety

### [Data SDK](./data/)
SDK for accessing and analyzing Avalanche blockchain data.

**Features:**
- Historical transaction data
- Address balance tracking
- Contract interaction data
- Real-time blockchain analytics
- Comprehensive data APIs

### [DevTools SDK](./devtools/)
Development tools and utilities for Avalanche developers.

**Features:**
- Development utilities
- Testing frameworks
- Debugging tools
- Network simulation
- Development workflow automation

### [Interchain SDK](./interchain/)
SDK for building cross-L1 applications and bridges.

**Features:**
- Type-safe ICM client for sending cross-chain messages
- Works seamlessly with wallet clients
- Built-in support for Avalanche C-Chain and custom subnets

### [Metrics SDK](./metrics/)
SDK for collecting and analyzing Avalanche network metrics.

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

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- TypeScript knowledge (recommended)

### Installation

Each SDK can be installed independently:

```bash
# Install specific SDKs
npm install @avalanche-sdk/client
npm install @avalanche-sdk/data
npm install @avalanche-sdk/devtools
npm install @avalanche-sdk/interchain
npm install @avalanche-sdk/metrics
npm install @avalanche-sdk/sdk
npm install @avalanche-sdk/webhooks
```

### Quick Example

```typescript
import { createAvalancheClient } from '@avalanche-sdk/client'
import { avalanche } from '@avalanche-sdk/client/chains'

// Create a client
const client = createAvalancheClient({
  chain: avalanche
  transport: {
    type: "http"
  }
})

// Get account balance
const balance = await client.getBalance({ 
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

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

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Submit** a pull request

### Development Setup

Each SDK in this repository has its own development setup and build process. For detailed development instructions, please refer to the individual SDK documentation.

## Support

### Documentation
- [API Reference](https://build.avax.network/docs/api-reference)


### Community
- [Discord](https://chat.avax.network/)
- [Telegram](https://t.me/+KDajA4iToKY2ZjBk)
- [Support](https://support.avax.network/en/)
- [Twitter](https://x.com/AvaxDevelopers)
- [Forum](https://forum.avax.network/)

### Issues
- [GitHub Issues](https://github.com/ava-labs/avalanche-sdk-typescript/issues)
- [Bug Reports](https://github.com/ava-labs/avalanche-sdk-typescript/issues/new?template=bug_report.md)
- [Feature Requests](https://github.com/ava-labs/avalanche-sdk-typescript/issues/new?template=feature_request.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Avalanche Team**

For more information about Avalanche, visit [avax.network](https://www.avax.network/).
