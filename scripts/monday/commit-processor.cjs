/* eslint-disable no-undef */
// @ts-check

/**
 * @typedef {import('./types.cjs').CommitRoot} CommitRoot
 */

const ticketIdReg = /\b\d{10}\b/;

/**
 * Process commits and group them by ticket ID
 * @param {CommitRoot[]} commits
 * @returns {Map<string, CommitRoot[]>}
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
      message: "Fix login issue 8996665933",
      author: {
        name: "Sumbat(testing)",
        email: "john@example.com",
        date: "2023-05-15T10:00:00Z",
      },
      committer: {
        name: "Sumbat",
        email: "sumbat15@gmail.com",
        date: "2025-04-20T09:12:11Z",
      },
    },
  },
];

module.exports = {
  processCommits,
  mockCommits,
  ticketIdReg,
};
