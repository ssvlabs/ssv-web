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

    // Get commits between branch and pre-stage
    const commits = await getCommits(owner, repo, headBranch, "pre-stage");
    console.log(`Found ${commits.length} commit(s) to include in PR`);

    // Create new PR from branch to pre-stage
    const newPR = await githubAPI(`/repos/${owner}/${repo}/pulls`, "POST", {
      title: `${headBranch} to Pre-Stage`,
      head: headBranch,
      base: "pre-stage",
      body: generatePRBody(headBranch, commits),
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
 * Get commits between two branches
 */
async function getCommits(owner, repo, headBranch, baseBranch) {
  try {
    // Get the compare endpoint which shows commits between branches
    const compare = await githubAPI(
      `/repos/${owner}/${repo}/compare/${baseBranch}...${headBranch}`,
    );
    
    if (compare.commits && compare.commits.length > 0) {
      return compare.commits.map((commit) => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message.split("\n")[0], // First line only
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        url: commit.html_url,
      }));
    }
    
    return [];
  } catch (error) {
    console.log("Error fetching commits:", error.message);
    return [];
  }
}

/**
 * Generate PR body content with commit list
 */
function generatePRBody(branchName, commits) {
  let body = `## Automated PR: ${branchName} to Pre-Stage

This PR was automatically created to merge changes from \`${branchName}\` to \`pre-stage\`.

### Changes`;

  if (commits.length > 0) {
    body += `\n\nThis PR contains **${commits.length} commit(s)**:\n\n`;
    
    commits.forEach((commit) => {
      const date = new Date(commit.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      body += `- [\`${commit.sha}\`](${commit.url}) ${commit.message} - _${commit.author}_ (${date})\n`;
    });
  } else {
    body += `\n\n- Contains all commits from the \`${branchName}\` branch`;
  }

  body += `\n### Review Required
Please review the changes before merging to \`pre-stage\`.

---
_This PR was automatically created by GitHub Actions._`;

  return body;
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

