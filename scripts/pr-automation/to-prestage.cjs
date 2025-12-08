/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

/**
 * Main function to execute the PR automation workflow for branches to pre-stage
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

    // Get branch information from environment
    const headBranch = process.env.PR_HEAD_REF || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF?.replace("refs/heads/", "");
    
    if (!headBranch) {
      console.error("Could not determine source branch");
      return;
    }

    // Skip if this is the pre-stage branch itself
    if (headBranch === "pre-stage") {
      console.log("Skipping - this is the pre-stage branch itself");
      return;
    }

    console.log("Starting PR automation workflow...");
    console.log(`Repository: ${process.env.GITHUB_REPOSITORY}`);
    console.log(`Source branch: ${headBranch}`);

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    // Check for existing PR from this branch to pre-stage
    console.log(`Checking for existing PRs from ${headBranch} to pre-stage...`);

    const existingPRs = await githubAPI(
      `/repos/${owner}/${repo}/pulls?head=${owner}:${headBranch}&base=pre-stage&state=open`,
    );

    if (existingPRs.length > 0) {
      const existingPR = existingPRs[0];
      console.log(
        `Found existing PR: #${existingPR.number} - ${existingPR.title}`,
      );
      console.log(`✅ PR already exists: ${existingPR.html_url}`);
      
      // Add reviewers to existing PR if not already added
      await addReviewers(owner, repo, existingPR.number);
      return;
    }

    console.log("No existing PR found. Creating new PR...");

    // Create new PR from branch to pre-stage
    const newPR = await githubAPI(`/repos/${owner}/${repo}/pulls`, "POST", {
      title: `${headBranch} to Pre-Stage`,
      head: headBranch,
      base: "pre-stage",
      body: generatePRBody(headBranch),
      draft: false,
    });

    console.log(`Created PR: #${newPR.number} - ${newPR.title}`);

    // Add reviewers to the PR
    await addReviewers(owner, repo, newPR.number);

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
function generatePRBody(branchName) {
  return `## Automated PR: ${branchName} to Pre-Stage

This PR was automatically created to merge changes from \`${branchName}\` to \`pre-stage\`.

### Changes
- Contains all commits from the \`${branchName}\` branch

### Review Required
Please review the changes before merging to \`pre-stage\`.

---
_This PR was automatically created by GitHub Actions._`;
}

/**
 * GitHub API helper function
 */
async function githubAPI(endpoint, method = "GET", body = null) {
  const url = `https://api.github.com${endpoint}`;
  const options = {
    method,
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHub-Actions",
    },
  };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return await response.json();
}

/**
 * Add reviewers to PR
 */
async function addReviewers(owner, repo, prNumber) {
  try {
    await githubAPI(
      `/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`,
      "POST",
      {
        reviewers: [
          "IlyaVi",
          "sumbat-ssvlabs",
          "Chris-ssvlabs",
          "axelrod-blox",
          "nir-ssvlabs",
          "stefan-ssv-labs",
        ],
      },
    );
    console.log("Successfully added reviewers to PR");
  } catch (error) {
    console.log(
      "Note: Some reviewers may not exist or may not have access to this repository",
    );
    console.log("Error details:", error.message);
  }
}

// Run the automation
runPRAutomation();

