---
name: Bug Report
about: Report a bug or issue in the Avalanche SDK TypeScript suite
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---
## 🐛 Bug Report

### 📋 Summary

<!-- Provide a clear and concise description of the bug -->

### 🎯 Which SDK(s) Are Affected?

<!-- Check all that apply -->

- [ ] `@avalanche-sdk/client` (Core RPC functionality)
- [ ] `@avalanche-sdk/data` (Data analytics and historical data)
- [ ] `@avalanche-sdk/chainkit` (All Data, Metrics and Webhooks API support)
- [ ] `@avalanche-sdk/interchain` (Cross-chain messaging)
- [ ] `@avalanche-sdk/sdk` (Unified SDK - all features)
- [ ] Documentation
- [ ] Examples
- [ ] Build system or tooling
- [ ] Other (please specify)

### 🔍 Bug Description

<!-- Describe the bug in detail. What happened? What did you expect to happen? -->

### 🎯 Expected Behavior

<!-- Describe what you expected to happen -->

### ❌ Actual Behavior

<!-- Describe what actually happened -->

### 📱 Steps to Reproduce

<!-- Provide detailed steps to reproduce the bug -->

1. **Environment Setup**:

   ```bash
   # List the commands you used to set up your environment
   ```
2. **Code Implementation**:

   ```typescript
   // Provide the code that reproduces the bug
   import { createAvalancheClient } from '@avalanche-sdk/client'

   const client = createAvalancheClient({
     // ... configuration
   })

   // Code that causes the bug
   ```
3. **Execution**:

   ```bash
   # Commands you ran
   ```
4. **Error Occurs**:

   <!-- Describe when and how the error occurs -->

### 🔧 Environment Information

#### System Information

- **OS**: [e.g., macOS 14.0, Ubuntu 22.04, Windows 11]
- **Node.js Version**: [e.g., 20.10.0]
- **npm/yarn/pnpm Version**: [e.g., npm 10.2.0]
- **TypeScript Version**: [e.g., 5.3.0]

#### Package Versions

<!-- List the exact versions of the affected packages -->

{
  "@avalanche-sdk/client": "0.0.4-alpha.10",
  "@avalanche-sdk/chainkit": "0.2.2",
  "@avalanche-sdk/interchain": "0.0.1-alpha.1",
  "@avalanche-sdk/sdk": "1.3.0",
}

#### Dependencies

<!-- List relevant dependencies that might be related to the issue -->

```json
{
  "viem": "^2.0.0",
  "typescript": "^5.0.0",
  // ... other dependencies
}
```

### 🚨 Error Messages & Logs

#### Console Output

```bash
# Paste the complete error message and stack trace
```

#### Network Errors (if applicable)

```bash
# Any network-related errors or failed requests
```

#### Build Errors (if applicable)

```bash
# TypeScript compilation errors, build failures, etc.
```

### 📊 Additional Context

#### Is this a regression?

- [ ] Yes, this worked in a previous version
- [ ] No, this is a new issue
- [ ] Unknown

#### Previous Working Version (if regression)

<!-- If this is a regression, specify the last working version -->

#### Frequency

- [ ] Always reproducible
- [ ] Sometimes reproducible
- [ ] Rarely reproducible
- [ ] Only under specific conditions

#### Impact

- [ ] **Critical** - Blocks all functionality
- [ ] **High** - Blocks major functionality
- [ ] **Medium** - Affects some features
- [ ] **Low** - Minor inconvenience

### 🧪 Debugging Information

#### Minimal Reproduction

<!-- Provide a minimal code example that reproduces the issue -->

```typescript
// Minimal reproduction code
// Remove all unnecessary code and dependencies
```

#### Workarounds

<!-- Are there any workarounds or temporary fixes you've found? -->

#### Related Issues

<!-- Have you found any similar issues? -->

### 📋 Checklist

#### Before Submitting

- [ ] I have searched existing issues to avoid duplicates
- [ ] I have provided a clear description of the bug
- [ ] I have included steps to reproduce the issue
- [ ] I have specified which SDK(s) are affected
- [ ] I have provided environment information
- [ ] I have included error messages and logs
- [ ] I have tested with the latest version of the affected package(s)

#### For Critical Issues

- [ ] I have tested with multiple Node.js versions
- [ ] I have tested with different package managers
- [ ] I have verified the issue occurs in a clean environment
- [ ] I have provided a minimal reproduction case

### 🔗 Related Information

#### Related Issues

<!-- Link to any related issues -->

#### Related Discussions

<!-- Link to any related discussions or forum posts -->

#### Documentation References

<!-- Link to relevant documentation sections -->

### 📞 Support Information

If you need immediate help or have questions:

- 💬 [Discord](https://discord.gg/avax) - Get real-time help
- 📱 [Telegram](https://t.me/+KDajA4iToKY2ZjBk) - Join discussions
- 🐦 [Twitter](https://x.com/AvaxDevelopers) - Stay updated
- 📧 Technical Issues: [GitHub Issues](https://github.com/ava-labs/avalanche-sdk-typescript/issues)
- 📧 Security Issues: security@avalabs.org
- 📧 General Inquiries: data-platform@avalabs.org

---

## 🔧 For Contributors

### Debugging Tips

- Check the [Troubleshooting Guide](https://github.com/ava-labs/avalanche-sdk-typescript#troubleshooting)
- Review [Common Issues](https://github.com/ava-labs/avalanche-sdk-typescript#common-issues)
- Check [Performance &amp; Best Practices](https://github.com/ava-labs/avalanche-sdk-typescript#performance--best-practices)

### Development Setup

```bash
# Clone and setup for debugging
git clone https://github.com/ava-labs/avalanche-sdk-typescript.git
cd avalanche-sdk-typescript
cd client
npm install
npm run build
```

---

**Thank you for helping improve the Avalanche SDK TypeScript suite! 🏔️**
