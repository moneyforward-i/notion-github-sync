const { GitHubService } = require('../src/github');

// Mock @actions/github
jest.mock('@actions/github', () => ({
  getOctokit: jest.fn()
}));

describe('GitHubService', () => {
  let githubService;
  let mockOctokit;

  beforeEach(() => {
    const { getOctokit } = require('@actions/github');
    mockOctokit = {
      rest: {
        pulls: {
          get: jest.fn()
        },
        repos: {
          get: jest.fn()
        }
      }
    };
    getOctokit.mockReturnValue(mockOctokit);
    githubService = new GitHubService('token');
  });

  describe('getPullRequest', () => {
    test('should fetch pull request data', async () => {
      const mockPRData = {
        number: 123,
        title: 'Test PR',
        html_url: 'https://github.com/test/repo/pull/123',
        state: 'open',
        draft: false,
        merged: false,
        user: { login: 'testuser' }
      };

      mockOctokit.rest.pulls.get.mockResolvedValue({ data: mockPRData });

      const result = await githubService.getPullRequest('owner', 'repo', 123);

      expect(result).toEqual(mockPRData);
      expect(mockOctokit.rest.pulls.get).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        pull_number: 123
      });
    });

    test('should handle API errors', async () => {
      mockOctokit.rest.pulls.get.mockRejectedValue(new Error('API Error'));

      await expect(githubService.getPullRequest('owner', 'repo', 123))
        .rejects.toThrow('Failed to fetch PR data: API Error');
    });
  });

  describe('getRepository', () => {
    test('should fetch repository data', async () => {
      const mockRepoData = {
        full_name: 'owner/repo',
        private: false
      };

      mockOctokit.rest.repos.get.mockResolvedValue({ data: mockRepoData });

      const result = await githubService.getRepository('owner', 'repo');

      expect(result).toEqual(mockRepoData);
      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo'
      });
    });
  });

  describe('mapPRStatus', () => {
    test('should map draft PR to Draft', () => {
      const prData = { draft: true, state: 'open', merged: false };
      expect(githubService.mapPRStatus(prData)).toBe('Draft');
    });

    test('should map merged PR to Merged', () => {
      const prData = { draft: false, state: 'closed', merged: true };
      expect(githubService.mapPRStatus(prData)).toBe('Merged');
    });

    test('should map closed PR to Closed', () => {
      const prData = { draft: false, state: 'closed', merged: false };
      expect(githubService.mapPRStatus(prData)).toBe('Closed');
    });

    test('should map open PR to Open', () => {
      const prData = { draft: false, state: 'open', merged: false };
      expect(githubService.mapPRStatus(prData)).toBe('Open');
    });

    test('should handle unknown state', () => {
      const prData = { draft: false, state: 'unknown', merged: false };
      expect(githubService.mapPRStatus(prData)).toBe('Unknown');
    });
  });
});