# Contributing to Avalanche SDK TypeScript

Thank you for your interest in contributing to the Avalanche SDK TypeScript! We're excited to have you as part of our community. This document provides guidelines for contributing to this repository.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to data-platform@avalabs.org.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, please include:

- A clear and descriptive title
- Detailed steps to reproduce the issue
- Expected behavior vs actual behavior
- Any relevant logs, screenshots, or error messages
- Your environment details (OS, Node.js version, package versions)
  - You can collect this using `npx envinfo` if you have Node.js installed

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Pull Requests

We welcome pull requests! Here's how to contribute code:

1. **Fork the repository** and create your branch from `main`
2. **Open a directory and Install dependencies** in the directory:
   ```bash
   cd client
   npm install
   ```
3. **Make your changes** in the appropriate package directory
4. **Add tests** for any new functionality
5. **Ensure tests pass** by running:
   ```bash
   npm test
   ```
6. **Follow the coding style** - we use ESLint for code linting
7. **Commit your changes** using clear, descriptive commit messages
8. **Push to your fork** and submit a pull request

### Development Setup

This is a monorepo containing multiple packages. To get started:

1. Clone the repository:
   ```bash
   git clone https://github.com/ava-labs/avalanche-sdk-typescript.git
   cd avalanche-sdk-typescript
   ```

2. Navigate to the package you want to work on:
   ```bash
   cd client  # or data, devtools, sdk, etc.
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the package:
   ```bash
   npm run build:all
   ```

### Package Structure

- **client/** - Core Avalanche client SDK
- **data/** - Data API SDK (contains generated code)
- **devtools/** - Development tools (contains generated code)
- **sdk/** - Main SDK package combining client and devtools
- **interchain/** - Interchain messaging SDK
- **metrics/** - Metrics SDK (contains generated code)
- **webhooks/** - Webhooks SDK (contains generated code)

**Note:** Some packages contain generated code. For these packages, we do not accept direct changes to the generated files. Instead, please report issues and we'll address them in the upstream source.

### Coding Standards

- Use TypeScript for all new code
- Follow existing code style and patterns
- Write clear, self-documenting code
- Add TSDoc comments for public APIs/Methods
- Keep functions small and focused
- Write unit tests for new functionality

### Commit Messages

We follow conventional commit message format:

```
type(scope): subject

body

footer
```

Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

Example:
```
feat(client): add support for subnet validation

Added new methods to support subnet validator operations
including add/remove validator functionality.

Closes #123
```

### Testing

- Write unit tests for all new functionality
- Ensure all tests pass before submitting PR
- Aim for high test coverage
- Use meaningful test descriptions

### Documentation

- Update README.md files when adding new features
- Add TSDoc comments for public APIs/Methods
- Include code examples where helpful
- Keep documentation up-to-date with code changes

## Questions?

If you have questions, please:

1. Check existing issues and documentation
2. Open a GitHub issue for clarification
3. Reach out to the maintainers at data-platform@avalabs.org

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

Thank you for contributing to Avalanche SDK TypeScript! 🚀
