const { NotionService } = require('../src/notion');

// Mock the @notionhq/client
jest.mock('@notionhq/client', () => ({
  Client: jest.fn().mockImplementation(() => ({
    databases: {
      query: jest.fn(),
      retrieve: jest.fn(),
      create: jest.fn()
    },
    pages: {
      create: jest.fn(),
      update: jest.fn()
    }
  }))
}));

describe('NotionService', () => {
  let notionService;
  let mockNotion;

  beforeEach(() => {
    const { Client } = require('@notionhq/client');
    notionService = new NotionService('secret_test_token');
    mockNotion = Client.mock.results[Client.mock.results.length - 1].value;
  });

  describe('findPageByPR', () => {
    test('should find existing page', async () => {
      const mockPage = { id: 'page-123' };
      mockNotion.databases.query.mockResolvedValue({
        results: [mockPage]
      });

      const result = await notionService.findPageByPR(
        'db-123',
        456,
        'test-repo',
        'PR Number',
        'Repository'
      );

      expect(result).toEqual(mockPage);
      expect(mockNotion.databases.query).toHaveBeenCalledWith({
        database_id: 'db-123',
        filter: {
          and: [
            {
              property: 'PR Number',
              number: {
                equals: 456
              }
            },
            {
              property: 'Repository',
              rich_text: {
                equals: 'test-repo'
              }
            }
          ]
        }
      });
    });

    test('should return null when no page found', async () => {
      mockNotion.databases.query.mockResolvedValue({
        results: []
      });

      const result = await notionService.findPageByPR(
        'db-123',
        456,
        'test-repo',
        'PR Number',
        'Repository'
      );

      expect(result).toBeNull();
    });
  });

  describe('createPage', () => {
    test('should create new page', async () => {
      const mockResponse = { id: 'page-new-123' };
      mockNotion.pages.create.mockResolvedValue(mockResponse);

      const prData = {
        title: 'Test PR',
        url: 'https://github.com/test/repo/pull/123',
        status: 'Open',
        number: 123,
        author: 'testuser',
        repository: 'test-repo',
        branch: 'feature-branch'
      };

      const inputs = {
        prTitleProperty: 'Title',
        prUrlProperty: 'GitHub URL',
        prStatusProperty: 'Status',
        prNumberProperty: 'PR Number',
        prAuthorProperty: 'Author',
        prRepositoryProperty: 'Repository',
        prBranchProperty: 'Branch'
      };

      const result = await notionService.createPage('db-123', prData, inputs);

      expect(result).toBe('page-new-123');
      expect(mockNotion.pages.create).toHaveBeenCalledWith({
        parent: { database_id: 'db-123' },
        properties: expect.objectContaining({
          'Title': {
            title: [
              {
                text: {
                  content: 'Test PR'
                }
              }
            ]
          },
          'GitHub URL': {
            url: 'https://github.com/test/repo/pull/123'
          },
          'Status': {
            select: {
              name: 'Open'
            }
          }
        })
      });
    });
  });

  describe('updatePage', () => {
    test('should update existing page', async () => {
      const mockResponse = { id: 'page-123' };
      mockNotion.pages.update.mockResolvedValue(mockResponse);

      const prData = {
        title: 'Updated PR Title',
        url: 'https://github.com/test/repo/pull/123',
        status: 'Closed',
        number: 123,
        author: 'testuser',
        repository: 'test-repo',
        branch: 'feature-branch'
      };

      const inputs = {
        prTitleProperty: 'Title',
        prUrlProperty: 'GitHub URL',
        prStatusProperty: 'Status'
      };

      const result = await notionService.updatePage('page-123', prData, inputs);

      expect(result).toBe('page-123');
      expect(mockNotion.pages.update).toHaveBeenCalledWith({
        page_id: 'page-123',
        properties: expect.objectContaining({
          'Status': {
            select: {
              name: 'Closed'
            }
          }
        })
      });
    });
  });

  describe('buildProperties', () => {
    test('should build correct properties object', () => {
      const prData = {
        title: 'Test PR',
        url: 'https://github.com/test/repo/pull/123',
        status: 'Open',
        number: 123,
        author: 'testuser',
        repository: 'test-repo',
        branch: 'feature-branch'
      };

      const inputs = {
        prTitleProperty: 'Title',
        prUrlProperty: 'GitHub URL',
        prStatusProperty: 'Status',
        prNumberProperty: 'PR Number',
        prAuthorProperty: 'Author',
        prRepositoryProperty: 'Repository',
        prBranchProperty: 'Branch'
      };

      const result = notionService.buildProperties(prData, inputs);

      expect(result).toEqual({
        'Title': {
          title: [
            {
              text: {
                content: 'Test PR'
              }
            }
          ]
        },
        'GitHub URL': {
          url: 'https://github.com/test/repo/pull/123'
        },
        'Status': {
          select: {
            name: 'Open'
          }
        },
        'PR Number': {
          number: 123
        },
        'Author': {
          rich_text: [
            {
              text: {
                content: 'testuser'
              }
            }
          ]
        },
        'Repository': {
          rich_text: [
            {
              text: {
                content: 'test-repo'
              }
            }
          ]
        },
        'Branch': {
          rich_text: [
            {
              text: {
                content: 'feature-branch'
              }
            }
          ]
        }
      });
    });
  });
});