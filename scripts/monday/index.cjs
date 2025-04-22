/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const {
  processCommits,
  mockCommits,
  ticketIdReg,
} = require("./commit-processor.cjs");
const {
  updateMonday,
  postMondayAPI,
  updateTicketStatus,
  addStageDeploymentComment,
} = require("./api-client.cjs");

/**
 * Main function to execute the Monday automation workflow
 */
async function runMondayAutomation() {
  try {
    if (!process.env.COMMITS_URL) {
      console.error("COMMITS_URL is not set");
      return;
    }

    if (!process.env.MONDAY_API_KEY) {
      console.error("MONDAY_API_KEY is not set");
      return;
    }

    console.log("Starting Monday automation workflow...");

    // Fetch commits from GitHub API
    const commits = await fetch(process.env.COMMITS_URL)
      .then((res) => res.json())
      .catch((error) => {
        console.error("Failed to fetch commits:", error);
        return [];
      });

    if (!commits || commits.length === 0) {
      console.log("No commits found to process");
      return;
    }

    // Process commits to get ticket IDs
    const processedTickets = processCommits(commits);

    // Update Monday tickets
    await updateMonday(processedTickets);

    console.log("Monday automation completed successfully");
  } catch (error) {
    console.error("Error running Monday automation:", error);
  }
}

// For testing with mock data
async function runWithMockData() {
  if (!process.env.COMMITS_URL) {
    console.error("COMMITS_URL is not set");
    return;
  }

  if (!process.env.MONDAY_API_KEY) {
    console.error("MONDAY_API_KEY is not set");
    return;
  }
  const processedTickets = processCommits(mockCommits);
  await updateMonday(processedTickets);
}

runMondayAutomation();
