const { getOctokit } = require('@actions/github');

class GitHubService {
  constructor(token) {
    this.octokit = getOctokit(token);
  }

  async getPullRequest(owner, repo, pullNumber) {
    try {
      const { data } = await this.octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch PR data: ${error.message}`);
    }
  }

  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch repository data: ${error.message}`);
    }
  }

  mapPRStatus(prData) {
    if (prData.draft) {
      return 'Draft';
    }
    
    if (prData.merged) {
      return 'Merged';
    }
    
    if (prData.state === 'closed') {
      return 'Closed';
    }
    
    if (prData.state === 'open') {
      return 'Open';
    }
    
    return 'Unknown';
  }
}

module.exports = { GitHubService };