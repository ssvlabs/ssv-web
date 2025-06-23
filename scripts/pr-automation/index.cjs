/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

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

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    // Check for existing PR from pre-stage to stage
    console.log("Checking for existing PRs from pre-stage to stage...");

    const existingPRs = await githubAPI(
      `/repos/${owner}/${repo}/pulls?head=${owner}:pre-stage&base=stage&state=open`,
    );

    if (existingPRs.length > 0) {
      const existingPR = existingPRs[0];
      console.log(
        `Found existing PR: #${existingPR.number} - ${existingPR.title}`,
      );
      console.log(`✅ Skipping - PR already exists: ${existingPR.html_url}`);
      return;
    }

    console.log("No existing PR found. Creating new PR...");

    // Create new PR
    const newPR = await githubAPI(`/repos/${owner}/${repo}/pulls`, "POST", {
      title: "Pre-Stage to Stage",
      head: "pre-stage",
      base: "stage",
      body: generatePRBody(),
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
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
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
          "axelrod-blox",
          "nir-ssvlabs",
          "sumbat-ssvlabs",
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
