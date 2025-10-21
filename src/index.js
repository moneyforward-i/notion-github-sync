const core = require('@actions/core');
const github = require('@actions/github');
const { NotionService } = require('./notion');
const { validateInputs, getPRData } = require('./utils');

async function run() {
  try {
    const inputs = {
      notionToken: core.getInput('notion-token'),
      notionDatabaseId: core.getInput('notion-database-id'),
      githubToken: core.getInput('github-token'),
      prTitleProperty: core.getInput('pr-title-property') || 'Title',
      prUrlProperty: core.getInput('pr-url-property') || 'GitHub URL',
      prStatusProperty: core.getInput('pr-status-property') || 'Status',
      prNumberProperty: core.getInput('pr-number-property') || 'PR Number',
      prAuthorProperty: core.getInput('pr-author-property') || 'Author',
      prRepositoryProperty: core.getInput('pr-repository-property') || 'Repository',
      prBranchProperty: core.getInput('pr-branch-property') || 'Branch'
    };

    validateInputs(inputs);

    const notionService = new NotionService(inputs.notionToken);

    const context = github.context;
    const prData = getPRData(context);

    if (!prData) {
      core.setFailed('This action can only be triggered by pull request events');
      return;
    }

    core.info(`Processing PR #${prData.number}: ${prData.title}`);
    core.info(`Event: ${context.eventName}, Action: ${context.payload.action}`);

    const existingPage = await notionService.findPageByPR(
      inputs.notionDatabaseId,
      prData.number,
      prData.repository,
      inputs.prNumberProperty,
      inputs.prRepositoryProperty
    );

    let pageId;
    let syncStatus;

    if (existingPage) {
      pageId = await notionService.updatePage(existingPage.id, prData, inputs);
      syncStatus = 'updated';
      core.info(`Updated existing Notion page: ${pageId}`);
    } else {
      pageId = await notionService.createPage(inputs.notionDatabaseId, prData, inputs);
      syncStatus = 'created';
      core.info(`Created new Notion page: ${pageId}`);
    }

    core.setOutput('notion-page-id', pageId);
    core.setOutput('sync-status', syncStatus);

    core.info(`Successfully synced PR #${prData.number} with Notion`);
  } catch (error) {
    core.error(`Error: ${error.message}`);
    core.setFailed(error.message);
  }
}

run();