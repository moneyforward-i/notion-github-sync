const { Client } = require('@notionhq/client');

class NotionService {
  constructor(token) {
    this.notion = new Client({ 
      auth: token,
      notionVersion: '2025-09-03'
    });
  }

  async findPageByPR(databaseId, prNumber, repository, prNumberProperty, prRepositoryProperty) {
    try {
      const response = await this.notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: prNumberProperty,
              number: {
                equals: prNumber
              }
            },
            {
              property: prRepositoryProperty,
              rich_text: {
                equals: repository
              }
            }
          ]
        }
      });

      return response.results.length > 0 ? response.results[0] : null;
    } catch (error) {
      throw new Error(`Failed to search Notion database: ${error.message}`);
    }
  }

  async createPage(databaseId, prData, inputs) {
    try {
      const properties = this.buildProperties(prData, inputs);
      
      const response = await this.notion.pages.create({
        parent: { database_id: databaseId },
        properties
      });

      return response.id;
    } catch (error) {
      throw new Error(`Failed to create Notion page: ${error.message}`);
    }
  }

  async updatePage(pageId, prData, inputs) {
    try {
      const properties = this.buildProperties(prData, inputs);
      
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties
      });

      return response.id;
    } catch (error) {
      throw new Error(`Failed to update Notion page: ${error.message}`);
    }
  }

  buildProperties(prData, inputs) {
    const properties = {};

    // Title property (special handling for title type)
    if (inputs.prTitleProperty) {
      properties[inputs.prTitleProperty] = {
        title: [
          {
            text: {
              content: prData.title
            }
          }
        ]
      };
    }

    // URL property
    if (inputs.prUrlProperty && prData.url) {
      properties[inputs.prUrlProperty] = {
        url: prData.url
      };
    }

    // Status property (select type)
    if (inputs.prStatusProperty && prData.status) {
      properties[inputs.prStatusProperty] = {
        select: {
          name: prData.status
        }
      };
    }

    // Number property
    if (inputs.prNumberProperty && prData.number) {
      properties[inputs.prNumberProperty] = {
        number: prData.number
      };
    }

    // Author property (rich text)
    if (inputs.prAuthorProperty && prData.author) {
      properties[inputs.prAuthorProperty] = {
        rich_text: [
          {
            text: {
              content: prData.author
            }
          }
        ]
      };
    }

    // Repository property (rich text)
    if (inputs.prRepositoryProperty && prData.repository) {
      properties[inputs.prRepositoryProperty] = {
        rich_text: [
          {
            text: {
              content: prData.repository
            }
          }
        ]
      };
    }

    // Branch property (rich text)
    if (inputs.prBranchProperty && prData.branch) {
      properties[inputs.prBranchProperty] = {
        rich_text: [
          {
            text: {
              content: prData.branch
            }
          }
        ]
      };
    }

    return properties;
  }

  async verifyDatabaseAccess(databaseId) {
    try {
      const response = await this.notion.databases.retrieve({
        database_id: databaseId
      });
      return response;
    } catch (error) {
      throw new Error(`Cannot access Notion database: ${error.message}`);
    }
  }

  async createDatabaseIfNeeded(parentPageId, title = 'GitHub Pull Requests') {
    try {
      const response = await this.notion.databases.create({
        parent: {
          page_id: parentPageId
        },
        title: [
          {
            text: {
              content: title
            }
          }
        ],
        properties: {
          'Title': {
            title: {}
          },
          'GitHub URL': {
            url: {}
          },
          'Status': {
            select: {
              options: [
                { name: 'Open', color: 'green' },
                { name: 'Closed', color: 'red' },
                { name: 'Merged', color: 'purple' },
                { name: 'Draft', color: 'yellow' }
              ]
            }
          },
          'PR Number': {
            number: {}
          },
          'Author': {
            rich_text: {}
          },
          'Repository': {
            rich_text: {}
          },
          'Branch': {
            rich_text: {}
          }
        }
      });

      return response.id;
    } catch (error) {
      throw new Error(`Failed to create Notion database: ${error.message}`);
    }
  }
}

module.exports = { NotionService };