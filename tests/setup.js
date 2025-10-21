// Jest setup file
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock environment variables
process.env.GITHUB_WORKSPACE = '/tmp/workspace';
process.env.GITHUB_REPOSITORY = 'test-owner/test-repo';
process.env.GITHUB_EVENT_NAME = 'pull_request';
process.env.GITHUB_ACTOR = 'test-actor';