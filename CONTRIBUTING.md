# Contributing to Local Web Brain

First off, thank you for considering contributing to Local Web Brain! 🎉

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Screenshots** if applicable
- **Environment details** (Chrome version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** and detailed description
- **Use case** explanation
- **Mockups** or examples if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code lints (`npm run lint`)
5. Format your code (`npm run format`)
6. Write a clear commit message

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/local-web-brain.git

# Install dependencies
npm install

# Create a branch
git checkout -b feature/my-feature

# Make changes and test
npm run dev
npm test

# Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/my-feature
```

## Coding Standards

- **TypeScript**: Use strict mode, avoid `any`
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: Use JSDoc for functions, inline for complex logic
- **Architecture**: Follow clean architecture patterns
- **Testing**: Write unit tests for new features

## Commit Message Format

Follow conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

Thank you for your contribution! 🙌
