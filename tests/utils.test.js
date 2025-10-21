const { validateInputs, isValidNotionId, getPRData, mapPRStatus } = require('../src/utils');

describe('Utils', () => {
  describe('validateInputs', () => {
    test('should pass with valid inputs', () => {
      const inputs = {
        notionToken: 'secret_test',
        notionDatabaseId: '12345678-1234-1234-1234-123456789012',
        githubToken: 'ghp_test'
      };
      
      expect(() => validateInputs(inputs)).not.toThrow();
    });

    test('should throw error if notion-token is missing', () => {
      const inputs = {
        notionDatabaseId: '12345678-1234-1234-1234-123456789012',
        githubToken: 'ghp_test'
      };
      
      expect(() => validateInputs(inputs)).toThrow('notion-token is required');
    });

    test('should throw error if notion-database-id is missing', () => {
      const inputs = {
        notionToken: 'secret_test',
        githubToken: 'ghp_test'
      };
      
      expect(() => validateInputs(inputs)).toThrow('notion-database-id is required');
    });

    test('should throw error if github-token is missing', () => {
      const inputs = {
        notionToken: 'secret_test',
        notionDatabaseId: '12345678-1234-1234-1234-123456789012'
      };
      
      expect(() => validateInputs(inputs)).toThrow('github-token is required');
    });
  });

  describe('isValidNotionId', () => {
    test('should validate correct UUID format', () => {
      expect(isValidNotionId('12345678-1234-1234-1234-123456789012')).toBe(true);
    });

    test('should validate correct 32-character format', () => {
      expect(isValidNotionId('12345678123412341234123456789012')).toBe(true);
    });

    test('should reject invalid formats', () => {
      expect(isValidNotionId('invalid-id')).toBe(false);
      expect(isValidNotionId('12345')).toBe(false);
      expect(isValidNotionId('')).toBe(false);
    });
  });

  describe('getPRData', () => {
    test('should extract PR data from pull_request context', () => {
      const context = {
        eventName: 'pull_request',
        payload: {
          action: 'opened',
          pull_request: {
            number: 123,
            title: 'Test PR',
            html_url: 'https://github.com/test/repo/pull/123',
            user: { login: 'testuser' },
            head: { ref: 'feature-branch' },
            base: { ref: 'main' },
            state: 'open',
            draft: false,
            merged: false,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T01:00:00Z'
          },
          repository: {
            full_name: 'test-owner/test-repo'
          }
        }
      };

      const result = getPRData(context);

      expect(result).toEqual({
        number: 123,
        title: 'Test PR',
        url: 'https://github.com/test/repo/pull/123',
        status: 'Open',
        author: 'testuser',
        repository: 'test-owner/test-repo',
        branch: 'feature-branch',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T01:00:00Z',
        merged: false,
        draft: false,
        state: 'open'
      });
    });

    test('should return null for non-PR events', () => {
      const context = {
        eventName: 'push',
        payload: {}
      };

      expect(getPRData(context)).toBeNull();
    });
  });

  describe('mapPRStatus', () => {
    test('should map draft PR to Draft', () => {
      const pr = { draft: true, state: 'open', merged: false };
      expect(mapPRStatus(pr, 'opened')).toBe('Draft');
    });

    test('should map merged PR to Merged', () => {
      const pr = { draft: false, state: 'closed', merged: true };
      expect(mapPRStatus(pr, 'closed')).toBe('Merged');
    });

    test('should map closed PR to Closed', () => {
      const pr = { draft: false, state: 'closed', merged: false };
      expect(mapPRStatus(pr, 'closed')).toBe('Closed');
    });

    test('should map open PR to Open', () => {
      const pr = { draft: false, state: 'open', merged: false };
      expect(mapPRStatus(pr, 'opened')).toBe('Open');
    });
  });
});