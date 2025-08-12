# Changelog Guidelines

This document provides guidelines for maintaining the changelog for the Avalanche SDK TypeScript suite.

## 📋 Legend

- 🚀 **Added** - New features
- 🔧 **Changed** - Changes in existing functionality
- 🐛 **Fixed** - Bug fixes
- ⚠️ **Deprecated** - Features that will be removed
- 🗑️ **Removed** - Removed features
- 🔒 **Security** - Security fixes
- 📚 **Documentation** - Documentation updates
- 🧪 **Testing** - Test improvements
- 🏗️ **Build** - Build system changes

## 📝 Contributing to Changelog

When adding new entries to the changelog, please follow these guidelines:

1. **Use the appropriate emoji** for the type of change
2. **Group changes by type** (Added, Changed, Fixed, etc.)
3. **Be descriptive** but concise
4. **Include breaking changes** prominently
5. **Add dates** for each version
6. **Link to issues/PRs** when relevant

## Template for New Versions

```markdown
### [X.Y.Z] - YYYY-MM-DD
**Release Type** (Stable/Beta/Alpha)

🚀 **Added**
- New feature 1
- New feature 2

🔧 **Changed**
- Change 1
- Change 2

🐛 **Fixed**
- Bug fix 1
- Bug fix 2

⚠️ **Deprecated**
- Deprecated feature 1

🗑️ **Removed**
- Removed feature 1

🔒 **Security**
- Security fix 1

📚 **Documentation**
- Doc update 1

🧪 **Testing**
- Test improvement 1

🏗️ **Build**
- Build change 1
```

## 📦 SDK Package Structure

The changelog is organized by SDK package:

- `@avalanche-sdk/chainkit` - chainkit SDK
- `@avalanche-sdk/client` - Avalanche RPC Client SDK
- `@avalanche-sdk/interchain` - Cross-Chain Messaging SDK

## 🔄 Version History

### Previous Releases

#### [0.0.1] - 2024-12-19

**Initial Release**

🚀 **Added**

- Initial release with multiple packages in monorepo structure
- Add `@avalanche-sdk/sdk` package - Main SDK combining client and chainkit functionality
- Add `@avalanche-sdk/data` package - Data API SDK for Avalanche network data
- Add `@avalanche-sdk/client` package - Core RPC client with C-Chain, P-Chain, and X-Chain support
- Add `@avalanche-sdk/interchain` package - ICM/ICTT messaging and Teleporter integration
- Add `@avalanche-sdk/chainkit` package - Development tools and utilities
- Add `@avalanche-sdk/metrics` package - Metrics and health check APIs
- Add `@avalanche-sdk/webhooks` package - Webhook handling with signature validation
- Add TypeScript support across all packages
- Add comprehensive documentation
- Add Code of Conduct

## 🔗 Links

- [GitHub Repository](https://github.com/ava-labs/avalanche-sdk-typescript)
- [Documentation](https://docs.avax.network)
- [API Reference](https://build.avax.network/docs/api-reference)
- [Discord Community](https://discord.gg/avax)
- [Telegram](https://t.me/+KDajA4iToKY2ZjBk)
- [Twitter](https://x.com/AvaxDevelopers)

---

**🏔️ Built with ❤️ by the Avalanche Team**
