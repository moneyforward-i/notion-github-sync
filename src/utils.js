const core = require('@actions/core');

function validateInputs(inputs) {
  if (!inputs.notionToken) {
    throw new Error('notion-token is required');
  }

  if (!inputs.notionDatabaseId) {
    throw new Error('notion-database-id is required');
  }

  if (!inputs.githubToken) {
    throw new Error('github-token is required');
  }

  if (inputs.notionDatabaseId && !isValidNotionId(inputs.notionDatabaseId)) {
    throw new Error('notion-database-id must be a valid Notion database ID');
  }
}

function isValidNotionId(id) {
  const notionIdRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$|^[a-f0-9]{32}$/;
  return notionIdRegex.test(id.replace(/-/g, ''));
}

function getPRData(context) {
  const { eventName, payload } = context;
  
  if (eventName !== 'pull_request' && eventName !== 'pull_request_target') {
    return null;
  }

  const pr = payload.pull_request;
  if (!pr) {
    return null;
  }

  const status = mapPRStatus(pr, payload.action);
  
  return {
    number: pr.number,
    title: pr.title || `PR #${pr.number}`,
    url: pr.html_url,
    status: status,
    author: pr.user?.login || 'unknown',
    repository: payload.repository?.full_name || 'unknown/unknown',
    branch: pr.head?.ref || 'unknown',
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    merged: pr.merged || false,
    draft: pr.draft || false,
    state: pr.state
  };
}

function mapPRStatus(pr, action) {
  if (pr.draft) {
    return 'Draft';
  }
  
  if (pr.merged || action === 'closed' && pr.merged_at) {
    return 'Merged';
  }
  
  if (pr.state === 'closed' || action === 'closed') {
    return 'Closed';
  }
  
  if (pr.state === 'open' || action === 'opened' || action === 'reopened') {
    return 'Open';
  }
  
  return 'Open';
}

function logPREvent(context) {
  const { eventName, payload } = context;
  core.info(`GitHub Event: ${eventName}`);
  core.info(`Action: ${payload.action}`);
  
  if (payload.pull_request) {
    const pr = payload.pull_request;
    core.info(`PR #${pr.number}: ${pr.title}`);
    core.info(`Status: ${pr.state} (draft: ${pr.draft}, merged: ${pr.merged})`);
    core.info(`Author: ${pr.user?.login}`);
    core.info(`Repository: ${payload.repository?.full_name}`);
    core.info(`Branch: ${pr.head?.ref} -> ${pr.base?.ref}`);
  }
}

function sanitizeForNotion(text) {
  if (typeof text !== 'string') {
    return String(text);
  }
  
  // Remove control characters and limit length
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').substring(0, 2000);
}

module.exports = {
  validateInputs,
  isValidNotionId,
  getPRData,
  mapPRStatus,
  logPREvent,
  sanitizeForNotion
};