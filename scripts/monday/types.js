/* eslint-disable no-undef */
// @ts-check

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

module.exports = {
  // Type definitions are exported only for documentation
  // No actual values are exported from this file
} 