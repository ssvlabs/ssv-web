/* eslint-disable no-undef */
// @ts-check

/**
 * @typedef {import('./types.cjs').CommitRoot} CommitRoot
 */

/**
 * Generates a GraphQL mutation to update a ticket status to "Ready for QA"
 * @param {string} itemId - The Monday item ID
 * @param {string} boardId - The Monday board ID
 * @param {string} columnId - The Monday column ID
 * @returns {string} - GraphQL mutation
 */
function createUpdateStatusMutation(itemId, boardId, columnId) {
  return `mutation {
  change_simple_column_value (item_id:${itemId}, board_id:${boardId}, column_id:"${columnId}", value: "Ready for QA") {
    id
  }
}`;
}

/**
 * Generates a GraphQL mutation to create a comment with information about commits merged to stage
 * @param {string} itemId - The Monday item ID
 * @param {CommitRoot[]} commits - The commits related to this ticket
 * @returns {string} - GraphQL mutation
 */
function createStageDeploymentComment(itemId, commits) {
  // Create commit links using Monday-compatible HTML formatting
  const commitLinks = commits
    .map((commit) => {
      return `<li><a href="${commit.html_url}">${commit.commit.message.split("#")[0].trim()}</a> <span style="font-size:12px; color:gray"> by ${commit.commit.author.name}</span></li>`;
    })
    .join("");

  const bodyContent = `
  <p style="font-size:18px">
    <strong>⤴️ Merged to Stage Environment</strong>
  </p>
  <ul>${commitLinks}</ul>
  <p style="font-size:12px; margin-top:10px; color:gray">Will be live in 3 minutes on <a href="https://app.stage.ssv.network/">app.stage.ssv.network</a></p>
  `
    .replace(/>\s+</g, "><")
    .trim();

  // Create the message body with proper Monday HTML formatting
  // Properly escape the body content for GraphQL
  const escapedBody = JSON.stringify(bodyContent).slice(1, -1);

  return `mutation {
    create_update(item_id: ${itemId}, body: "${escapedBody}") {
      id
    }
  }`;
}

/**
 * Generates a GraphQL query to find tickets by IDs
 * @param {string[]} ticketIds - Monday ticket IDs
 * @returns {string} - GraphQL query
 */
function getFindTicketsQuery(ticketIds) {
  return `query {
  items(ids: [${ticketIds.join(",")}]) {
    id
    name
    board {
      id
      columns {
        id
        title
        type
      }
    }
  }
}`;
}

module.exports = {
  createUpdateStatusMutation,
  createStageDeploymentComment,
  getFindTicketsQuery,
};
