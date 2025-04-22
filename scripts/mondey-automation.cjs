/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

/**
 * Monday Automation Entry Point
 * This file serves as the entry point for automating ticket updates on Monday.com
 * based on GitHub commits.
 * 
 * The actual implementation has been refactored into a modular structure in the ./monday folder.
 */

const { runMondayAutomation, runWithMockData } = require('./monday');

// Execute the automation
try {
  // If we're in a testing environment or want to use mock data, uncomment:
  // runWithMockData();
  
  // For production use with real data:
  runMondayAutomation();
} catch (error) {
  console.error("Error in Monday automation:", error);
}

/**
 * @typedef {Object} Author
 * @property {string} name
 * @property {string} email
 * @property {string} date
 */

/**
 * @typedef {Object} Tree
 * @property {string} sha
 * @property {string} url
 */

/**
 * @typedef {Object} Verification
 * @property {boolean} verified
 * @property {string} reason
 * @property {null} signature
 * @property {null} payload
 * @property {null} verified_at
 */

/**
 * @typedef {Object} Commit
 * @property {Author} author
 * @property {Author} committer
 * @property {string} message
 * @property {Tree} tree
 * @property {string} url
 * @property {number} comment_count
 * @property {Verification} verification
 */

/**
 * @typedef {Object} Parent
 * @property {string} sha
 * @property {string} url
 * @property {string} html_url
 */

/**
 * @typedef {Object} Author2
 * @property {string} login
 * @property {number} id
 * @property {string} node_id
 * @property {string} avatar_url
 * @property {string} gravatar_id
 * @property {string} url
 * @property {string} html_url
 * @property {string} followers_url
 * @property {string} following_url
 * @property {string} gists_url
 * @property {string} starred_url
 * @property {string} subscriptions_url
 * @property {string} organizations_url
 * @property {string} repos_url
 * @property {string} events_url
 * @property {string} received_events_url
 * @property {string} type
 * @property {string} user_view_type
 * @property {boolean} site_admin
 */

/**
 * @typedef {Object} CommitRoot
 * @property {string} sha
 * @property {string} node_id
 * @property {Commit} commit
 * @property {string} url
 * @property {string} html_url
 * @property {string} comments_url
 * @property {Author2} author
 * @property {Author2} committer
 * @property {Parent[]} parents
 */

/**
 * @typedef {Object} MondayResponse
 * @property {object} data
 * @property {object[]} data.items
 * @property {string} data.items.id
 * @property {string} data.items.name
 * @property {object} data.items.board
 * @property {string} data.items.board.id
 */

const ticketIdReg = /\b\d{10}\b/;

// Mock data for testing
/**
 * @type {CommitRoot[]}
 */
const mockCommits = [
  {
    sha: "abc123",
    html_url:
      "https://github.com/ssvlabs/ssv-web/commit/1bc5097fb0045e40874e1bb67acebb9415a25ef1",
    commit: {
      message: "Fix login issue #8969579291",
      author: {
        name: "John Doe",
        email: "john@example.com",
        date: "2023-05-15T10:00:00Z",
      },
    },
  },
  {
    sha: "abc123",
    html_url:
      "https://github.com/ssvlabs/ssv-web/commit/1bc5097fb0045e40874e1bb67acebb9415a25ef1",
    commit: {
      message: "fix: added new feature #8969579291",
      author: {
        name: "John Doe",
        email: "john@example.com",
        date: "2023-05-15T10:00:00Z",
      },
    },
  },
  {
    sha: "abc123",
    html_url:
      "https://github.com/ssvlabs/ssv-web/commit/1bc5097fb0045e40874e1bb67acebb9415a25ef1",
    commit: {
      message: "fix: fix login issue #8969579291",
      author: {
        name: "John Doe",
        email: "john@example.com",
        date: "2023-05-15T10:00:00Z",
      },
    },
  },
  {
    sha: "abc123",
    html_url:
      "https://github.com/ssvlabs/ssv-web/commit/1bc5097fb0045e40874e1bb67acebb9415a25ef1",
    commit: {
      message: "style: added holesky sunset banner #8969579291",
      author: {
        name: "John Doe",
        email: "john@example.com",
        date: "2023-05-15T10:00:00Z",
      },
    },
  },
];

try {
  if (!process.env.COMMITS_URL) return console.error("COMMITS_URL is not set");
  if (!process.env.MONDAY_API_KEY)
    return console.error("MONDAY_API_KEY is not set");

  fetch(process.env.COMMITS_URL)
    .then((res) => /** @type {Promise<CommitRoot[]>} */ (res.json()))
    .then((commits) => {
      const processedTickets = processCommits(commits);
      return updateMonday(processedTickets);
    })
    .catch((error) => {
      console.error("error:", error);
    });
} catch (error) {
  console.error("error:", error);
}

/**
 * Process commits and group them by ticket ID
 * @param {CommitRoot[]} commits
 */
function processCommits(commits) {
  const ticketsMap = /** @type {Map<string, CommitRoot[]>} */ (new Map());

  commits.forEach((commit) => {
    const [ticketId] = commit.commit.message.match(ticketIdReg) || [];
    if (ticketId) {
      ticketsMap.set(ticketId, [...(ticketsMap.get(ticketId) || []), commit]);
    }
  });

  // Log results
  if (ticketsMap.size === 0) {
    console.log("No ticket IDs found in any commit messages.");
  } else {
    console.log([...ticketsMap.entries()]);
  }

  return ticketsMap;
}

processCommits(mockCommits);

const getUpdateStatusMutation = (itemId, boardId) => `mutation {
  change_simple_column_value (item_id:${itemId}, board_id:${boardId}, column_id:"bug_status", value: "Ready for QA") {
    id
  }
}`;

/**
 * @param {CommitRoot[]} commits
 * @returns {string}
 */
const getCreateCommentMutation = (itemId, commits) => {
  // Create commit links using Monday-compatible HTML formatting
  const commitLinks = commits
    .map(
      (commit) =>
        `<li><a href="${commit.html_url}">${commit.commit.message.split("#")[0].trim()}</a> <span style="font-size:12px; color:gray"> by ${commit.commit.author.name}</span></li>`,
    )
    .join("");

  const bodyContent = `
  <p style="font-size:18px">
    <strong>🪸 Merged to Stage Environment</strong>
  </p>
  <p>The following commits have been successfully merged to the stage branch</p>
  <ul>${commitLinks}</ul>`
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
};

const getFindTicketsQuery = (ticketIds) => `query {
  items(ids: [${ticketIds.join(",")}]) {
    id
    name
    board {
      id
    }
  }
}`;

/**
 * Updates Monday.com tickets to "Ready For QA" status
 * @param {Map<string, CommitRoot[]>} ticketsMap Map of ticket IDs to their commits
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

  const MONDAY_API_KEY = process.env.MONDAY_API_KEY;

  const boardIds = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: MONDAY_API_KEY,
    },
    body: JSON.stringify({
      query: getFindTicketsQuery([...ticketsMap.keys()]),
    }),
  })
    .then((res) => res.json())
    .then((/** @type {MondayResponse} */ response) => {
      console.log("response:", response);
      return new Map(
        response.data.items.map((item) => [item.id, item.board.id]),
      );
    });

  console.log("boardIds:", boardIds);

  for (const [ticketId, commits] of ticketsMap.entries()) {
    if (!boardIds.has(ticketId)) {
      console.log(`Ticket ${ticketId} not found in Monday.com`);
      continue;
    }
    try {
      console.log(
        `Processing ticket ${ticketId} with ${commits.length} commits`,
      );

      // First, find the ticket to get its board ID and other details

      const result = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: MONDAY_API_KEY,
        },
        body: JSON.stringify({
          query: getUpdateStatusMutation(ticketId, boardIds.get(ticketId)),
        }),
      }).then((res) => res.json());

      if (!result) {
        continue;
      }

      const commentResult = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: MONDAY_API_KEY,
        },
        body: JSON.stringify({
          query: getCreateCommentMutation(ticketId, commits),
        }),
      }).then((res) => res.json());

      console.log("commentResult:", commentResult);
    } catch (error) {
      console.error(`Failed to process ticket ${ticketId}:`, error);
    }
  }

  console.log("Monday.com update process completed");
}

// Example usage:
// Call processCommits and pass the result to updateMonday
const processedTickets = processCommits(mockCommits);
// Uncomment to run the update:
updateMonday(processedTickets);
