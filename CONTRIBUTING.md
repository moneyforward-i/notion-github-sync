# Contributing to Notion GitHub Sync

We welcome contributions to improve this GitHub Action! This document provides guidelines for contributing.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm
- Git

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/notion-github-sync.git
   cd notion-github-sync
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run tests:
   ```bash
   npm test
   ```

5. Build the action:
   ```bash
   npm run build
   ```

## Project Structure

```
├── action.yml           # GitHub Action metadata
├── src/
│   ├── index.js        # Main entry point
│   ├── github.js       # GitHub API service
│   ├── notion.js       # Notion API service
│   └── utils.js        # Utility functions
├── tests/              # Test files
├── dist/               # Built action (generated)
└── README.md           # Documentation
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new functionality
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run linter
npm run lint

# Build the action
npm run build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes  
- `docs:` for documentation
- `test:` for tests
- `refactor:` for refactoring

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Code Guidelines

### JavaScript Style

- Use modern JavaScript (ES6+)
- Prefer `const` and `let` over `var`
- Use async/await over promises
- Add JSDoc comments for functions
- Handle errors appropriately

Example:
```javascript
/**
 * Creates a new page in Notion database
 * @param {string} databaseId - The Notion database ID
 * @param {Object} prData - Pull request data
 * @param {Object} inputs - Action inputs
 * @returns {Promise<string>} The created page ID
 */
async function createPage(databaseId, prData, inputs) {
  try {
    // Implementation
  } catch (error) {
    throw new Error(`Failed to create page: ${error.message}`);
  }
}
```

### Testing

- Write unit tests for all new functions
- Use descriptive test names
- Test both success and error cases
- Mock external APIs (GitHub, Notion)

Example:
```javascript
describe('NotionService', () => {
  describe('createPage', () => {
    test('should create page with correct properties', async () => {
      // Test implementation
    });

    test('should handle API errors', async () => {
      // Error test
    });
  });
});
```

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release PR
4. After merge, create GitHub release
5. Update major version tag

## Reporting Issues

When reporting issues:

1. Check existing issues first
2. Use the issue template
3. Provide clear reproduction steps
4. Include relevant logs/errors
5. Specify versions (Node.js, action version)

## Feature Requests

For feature requests:

1. Check if it's already requested
2. Explain the use case
3. Consider if it fits the project scope
4. Be open to discussion

## Code of Conduct

Please be respectful and constructive in all interactions. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## Questions?

- Open a discussion on GitHub
- Check the documentation
- Review existing issues

Thank you for contributing! 🎉