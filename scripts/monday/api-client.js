/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

/**
 * @typedef {import('./types').CommitRoot} CommitRoot
 * @typedef {import('./types').MondayResponse} MondayResponse
 */

const queries = require('./monday-queries');

const MONDAY_API_URL = "https://api.monday.com/v2";

/**
 * Makes a request to the Monday.com API
 * @param {string} query - GraphQL query or mutation
 * @returns {Promise<any>} API response
 */
async function postMondayAPI(query) {
  return fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.MONDAY_API_KEY,
    },
    body: JSON.stringify({ query }),
  }).then((res) => res.json());
}

/**
 * Retrieves board IDs for multiple tickets
 * @param {string[]} ticketIds - Array of Monday ticket IDs
 * @returns {Promise<Map<string, string>>} Map of ticket IDs to board IDs
 */
async function getTicketBoardIds(ticketIds) {
  if (!ticketIds || ticketIds.length === 0) {
    return new Map();
  }

  const response = await postMondayAPI(
    queries.getFindTicketsQuery(ticketIds)
  );

  if (!response?.data?.items || !response.data.items.length) {
    console.log("No tickets found in Monday.com");
    return new Map();
  }

  return new Map(
    response.data.items.map((item) => [item.id, item.board.id])
  );
}

/**
 * Updates a ticket's status to "Ready for QA"
 * @param {string} itemId - Monday item ID
 * @param {string} boardId - Monday board ID
 * @returns {Promise<any>} API response
 */
async function updateTicketStatus(itemId, boardId) {
  console.log(`Updating ticket ${itemId} status to "Ready for QA"`);
  return postMondayAPI(
    queries.createUpdateStatusMutation(itemId, boardId)
  );
}

/**
 * Adds a deployment comment to a ticket with commit information
 * @param {string} itemId - Monday item ID
 * @param {CommitRoot[]} commits - Array of commits for this ticket
 * @returns {Promise<any>} API response
 */
async function addStageDeploymentComment(itemId, commits) {
  console.log(`Adding stage deployment comment to ticket ${itemId}`);
  return postMondayAPI(
    queries.createStageDeploymentComment(itemId, commits)
  );
}

/**
 * Updates a column value for a ticket
 * @param {string} itemId - Monday item ID
 * @param {string} boardId - Monday board ID
 * @param {string} columnId - Column ID to update
 * @param {string} value - New column value
 * @returns {Promise<any>} API response
 */
async function updateColumnValue(itemId, boardId, columnId, value) {
  console.log(`Updating ${columnId} column for ticket ${itemId} to "${value}"`);
  return postMondayAPI(
    `mutation {
      change_simple_column_value (item_id:${itemId}, board_id:${boardId}, column_id:"${columnId}", value: "${value}") {
        id
      }
    }`
  );
}

/**
 * Updates Monday.com tickets to "Ready For QA" status
 * @param {Map<string, CommitRoot[]>} ticketsMap - Map of ticket IDs to their commits
 * @returns {Promise<void>}
 */
async function updateMonday(ticketsMap) {
  if (ticketsMap.size === 0) {
    console.log("No tickets to update in Monday.com");
    return;
  }

  console.log(
    `Preparing to update ${ticketsMap.size} tickets in Monday.com to "Ready For QA" status...`,
  );

  try {
    const boardIds = await getTicketBoardIds([...ticketsMap.keys()]);

    for (const [ticketId, commits] of ticketsMap.entries()) {
      if (!boardIds.has(ticketId)) {
        console.log(`Ticket ${ticketId} not found in Monday.com`);
        continue;
      }
      
      try {
        console.log(
          `Processing ticket ${ticketId} with ${commits.length} commits`,
        );

        // Update ticket status to "Ready for QA"
        const updateResult = await updateTicketStatus(
          ticketId, 
          boardIds.get(ticketId)
        );
        
        if (!updateResult) {
          console.error(`Failed to update status for ticket ${ticketId}`);
          continue;
        }
        
        // Add commit information as an update
        const commentResult = await addStageDeploymentComment(ticketId, commits);

        console.log(`Comment added to ticket ${ticketId}:`, commentResult);
      } catch (error) {
        console.error(`Failed to process ticket ${ticketId}:`, error);
      }
    }
    
    console.log("Monday.com update process completed");
  } catch (error) {
    console.error("Error updating Monday tickets:", error);
  }
}

module.exports = {
  postMondayAPI,
  getTicketBoardIds,
  updateTicketStatus,
  addStageDeploymentComment,
  updateColumnValue,
  updateMonday
};
