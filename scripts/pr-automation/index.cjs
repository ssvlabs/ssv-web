/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const { Octokit } = require('@octokit/rest');

/**
 * Main function to execute the PR automation workflow
 */
async function runPRAutomation() {
  try {
    // Validate required environment variables
    if (!process.env.GITHUB_TOKEN) {
      console.error("GITHUB_TOKEN is not set");
      return;
    }

    if (!process.env.GITHUB_REPOSITORY) {
      console.error("GITHUB_REPOSITORY is not set");
      return;
    }

    console.log("Starting PR automation workflow...");
    console.log(`Repository: ${process.env.GITHUB_REPOSITORY}`);

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    // Check for existing PR from pre-stage to stage
    console.log("Checking for existing PRs from pre-stage to stage...");
    
    const { data: existingPRs } = await octokit.rest.pulls.list({
      owner,
      repo,
      head: `${owner}:pre-stage`,
      base: 'stage',
      state: 'open'
    });

    if (existingPRs.length > 0) {
      const existingPR = existingPRs[0];
      console.log(`Found existing PR: #${existingPR.number} - ${existingPR.title}`);
      console.log(`✅ Skipping - PR already exists: ${existingPR.html_url}`);
      return;
    }

    console.log("No existing PR found. Creating new PR...");

    // Create new PR
    const { data: newPR } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: 'Pre-Stage to Stage',
      head: 'pre-stage',
      base: 'stage',
      body: generatePRBody(),
      draft: false
    });

    console.log(`Created PR: #${newPR.number} - ${newPR.title}`);

    // Add reviewers to the PR
    await addReviewers(octokit, owner, repo, newPR.number);

    console.log(`✅ New PR created successfully: ${newPR.html_url}`);
    console.log("👥 Added reviewers to the PR");

  } catch (error) {
    console.error("Error running PR automation:", error);
    process.exit(1);
  }
}

/**
 * Generate PR body content
 */
function generatePRBody() {
  return `## Automated PR: Pre-Stage to Stage

This PR was automatically created to merge changes from \`pre-stage\` to \`stage\`.

### Changes
- Contains all commits from the latest push to \`pre-stage\` branch

### Review Required
Please review the changes before merging to \`stage\`.

---
_This PR was automatically created by GitHub Actions._`;
}

/**
 * Add reviewers to PR
 */
async function addReviewers(octokit, owner, repo, prNumber) {
  try {
    await octokit.rest.pulls.requestReviewers({
      owner,
      repo,
      pull_number: prNumber,
      reviewers: [
        'IlyaVi',
        'axelrod-blox',
        'nir-ssvlabs',
        'sumbat-ssvlabs'
      ]
    });
    console.log('Successfully added reviewers to PR');
  } catch (error) {
    console.log('Note: Some reviewers may not exist or may not have access to this repository');
    console.log('Error details:', error.message);
  }
}

// Run the automation
runPRAutomation(); 