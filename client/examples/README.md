# Avalanche SDK Client Examples

This directory contains practical examples demonstrating how to use the `@avalanche-sdk/client` package to interact with the Avalanche blockchain.

## Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Latest version recommended
- **TypeScript**: Examples are written in TypeScript

## Quick Start

### Option 1: Using the Latest Released Version

1. **Navigate to the examples directory:**
   ```bash
   cd client/examples
   ```

2. **Install the latest SDK version:**
   ```bash
   npm install @avalanche-sdk/client@latest
   ```

3. **Run any example:**
   ```bash
   npx tsx <example-file.ts>
   ```

### Option 2: Using a Local Development Build

1. **Build the SDK from source:**
   ```bash
   # From the project root
   npm run build:all
   ```

2. **Create a global symlink:**
   ```bash
   npm link
   ```

3. **Navigate to examples and link to local build:**
   ```bash
   cd client/examples
   npm link @avalanche-sdk/client
   ```

4. **Run any example:**
   ```bash
   npx tsx <example-file.ts>
   ```

## Available Examples

### Basic Examples
- **`sendAvax.ts`** - Basic AVAX transfer example

### Primary Network Transaction Examples
Located in `prepare-primary-network-txns/`:

#### Cross-Chain Transfers
- **`transfer-avax-from-x-chain-to-p-chain.ts`** - Transfer AVAX from X-Chain to P-Chain
- **`transfer-avax-from-p-chain-to-x-chain.ts`** - Transfer AVAX from P-Chain to X-Chain
- **`transfer-avax-from-x-chain-to-c-chain.ts`** - Transfer AVAX from X-Chain to C-Chain
- **`transfer-avax-from-c-chain-to-x-chain.ts`** - Transfer AVAX from C-Chain to X-Chain
- **`transfer-avax-from-p-chain-to-c-chain.ts`** - Transfer AVAX from P-Chain to C-Chain
- **`transfer-avax-from-c-chain-to-p-chain.ts`** - Transfer AVAX from C-Chain to P-Chain

#### Chain-Specific Examples
- **`x-chain/`** - X-Chain specific operations
- **`p-chain/`** - P-Chain specific operations  
- **`c-chain/`** - C-Chain specific operations

## Configuration

Most examples require configuration before running:

1. **Network Selection**: Examples default to Fuji testnet. Modify the network configuration in each example file to use mainnet or local network.

2. **Private Keys**: Replace placeholder private keys with your actual keys for testing.

3. **Addresses**: Update recipient addresses to valid Avalanche addresses.

## Important Notes

- **Testnet Usage**: Examples are configured for Fuji testnet by default. Use testnet AVAX for experimentation.
- **Security**: Never commit private keys or sensitive information to version control.
- **Node Version**: Ensure you're using Node.js version 20 or higher for compatibility.

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors:**
   - Ensure you've installed dependencies: `npm install`
   - Check that you're in the correct directory

2. **TypeScript compilation errors:**
   - Verify Node.js version: `node --version`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Network connection issues:**
   - Check your internet connection
   - Verify the RPC endpoint is accessible
   - Consider using a different RPC provider

## Additional Resources

- [Avalanche Network Documentation](https://build.avax.network/docs)
- [GitHub Repository](https://github.com/ava-labs/avalanche-sdk-typescript)

## Contributing

Found an issue or want to add more examples? Please contribute by:

1. Forking the repository
2. Creating a feature branch
3. Adding your example or fix
4. Submitting a pull request

---

**Happy building on Avalanche! 🏔️**


