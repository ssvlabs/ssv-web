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

// For testing with mock data
async function runWithMockData() {
  if (!process.env.MONDAY_API_KEY) {
    console.error("MONDAY_API_KEY is not set");
    return;
  }
  const processedTickets = processCommits(mockCommits);
  await updateMonday(processedTickets);
}

runWithMockData();
