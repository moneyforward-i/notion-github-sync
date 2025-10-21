# Notion GitHub Sync

A GitHub Action that automatically synchronizes GitHub Pull Request status with Notion databases. Keep your project management in Notion up-to-date with your development workflow.

## Features

- 🔄 **Automatic Sync**: Syncs PR status on open, close, merge, and other events
- 📊 **Notion Integration**: Creates and updates entries in your Notion database
- 🎯 **Customizable Properties**: Map GitHub PR data to custom Notion properties
- 🔍 **Smart Matching**: Avoids duplicates by matching PRs with existing entries
- ⚡ **Fast & Reliable**: Built with modern GitHub Actions best practices
- 🛡️ **Error Handling**: Comprehensive error handling and logging

## Quick Start

### 1. Set up Notion Integration

1. Create a new Notion integration at https://www.notion.so/my-integrations
2. Copy the integration token (starts with `secret_`)
3. Create or choose a Notion database for your PRs
4. Share the database with your integration

### 2. Create Notion Database Schema

Your Notion database should have these properties (default names):

| Property Name | Type | Description |
|---------------|------|-------------|
| Title | Title | PR title |
| GitHub URL | URL | Link to the PR |
| Status | Select | PR status (Open, Closed, Merged, Draft) |
| PR Number | Number | GitHub PR number |
| Author | Rich Text | PR author username |
| Repository | Rich Text | Repository name |
| Branch | Rich Text | Source branch name |

### 3. Add Workflow

Create `.github/workflows/notion-sync.yml`:

```yaml
name: Sync PR with Notion

on:
  pull_request:
    types: [opened, closed, reopened, ready_for_review, converted_to_draft]

jobs:
  sync-notion:
    runs-on: ubuntu-latest
    steps:
      - name: Sync PR with Notion
        uses: your-username/notion-github-sync@v1
        with:
          notion-token: ${{ secrets.NOTION_TOKEN }}
          notion-database-id: ${{ secrets.NOTION_DATABASE_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Configure Secrets

Add these secrets to your repository settings:

- `NOTION_TOKEN`: Your Notion integration token
- `NOTION_DATABASE_ID`: The ID of your Notion database

## Configuration

### Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `notion-token` | ✅ | - | Notion Integration Token |
| `notion-database-id` | ✅ | - | Notion Database ID |
| `github-token` | ❌ | `${{ github.token }}` | GitHub Token |
| `pr-title-property` | ❌ | `Title` | Notion property name for PR title |
| `pr-url-property` | ❌ | `GitHub URL` | Notion property name for GitHub URL |
| `pr-status-property` | ❌ | `Status` | Notion property name for PR status |
| `pr-number-property` | ❌ | `PR Number` | Notion property name for PR number |
| `pr-author-property` | ❌ | `Author` | Notion property name for PR author |
| `pr-repository-property` | ❌ | `Repository` | Notion property name for repository |
| `pr-branch-property` | ❌ | `Branch` | Notion property name for branch |

### Outputs

| Output | Description |
|--------|-------------|
| `notion-page-id` | The ID of the created/updated Notion page |
| `sync-status` | Status of sync operation (created, updated, or skipped) |

## Advanced Usage

### Custom Property Names

```yaml
- name: Sync PR with Notion
  uses: your-username/notion-pr-sync@v1
  with:
    notion-token: ${{ secrets.NOTION_TOKEN }}
    notion-database-id: ${{ secrets.NOTION_DATABASE_ID }}
    pr-title-property: 'Pull Request'
    pr-status-property: 'PR Status'
    pr-author-property: 'Developer'
```

### Multiple Events

```yaml
on:
  pull_request:
    types: [opened, closed, reopened, ready_for_review, converted_to_draft, synchronize]
  pull_request_review:
    types: [submitted]
```

### Conditional Sync

```yaml
jobs:
  sync-notion:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    steps:
      - name: Sync PR with Notion
        # ... rest of configuration
```

## Notion Database Setup

### Required Database Properties

The action expects these property types in your Notion database:

- **Title**: Must be a "Title" type property
- **GitHub URL**: Must be a "URL" type property  
- **Status**: Must be a "Select" type property with options: Open, Closed, Merged, Draft
- **PR Number**: Must be a "Number" type property
- **Author**: Must be a "Rich Text" type property
- **Repository**: Must be a "Rich Text" type property
- **Branch**: Must be a "Rich Text" type property

### Database Template

You can duplicate this Notion database template: [PR Tracking Template](https://notion.so/templates/pr-tracking)

Or create it manually:

1. Create a new database in Notion
2. Add the properties listed above with correct types
3. For the Status property, add select options: Open (green), Closed (red), Merged (purple), Draft (yellow)
4. Share the database with your Notion integration

## Troubleshooting

### Common Issues

#### "Cannot access Notion database"
- Ensure your database is shared with the integration
- Verify the database ID is correct
- Check that your Notion token is valid

#### "Property not found"
- Verify property names match exactly (case-sensitive)
- Ensure property types are correct
- Check for typos in property names

#### "Duplicate entries"
- The action matches by PR number and repository
- Ensure your database has the correct PR Number and Repository properties

### Getting Database ID

The database ID can be found in the Notion URL:
```
https://notion.so/workspace/DATABASE_ID?v=VIEW_ID
```

Or use this bookmarklet:
```javascript
javascript:alert(window.location.pathname.split('/')[1])
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/notion-github-sync.git
cd notion-github-sync

# Install dependencies
npm install

# Run tests
npm test

# Build the action
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/your-username/notion-github-sync/wiki)
- 🐛 [Issue Tracker](https://github.com/your-username/notion-github-sync/issues)
- 💬 [Discussions](https://github.com/your-username/notion-github-sync/discussions)

---

Made with ❤️ for the GitHub community