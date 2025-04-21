// @ts-check
/* eslint-disable @typescript-eslint/no-unused-vars */

interface CommitRoot {
  sha: string;
  node_id: string;
  commit: Commit;
  url: string;
  html_url: string;
  comments_url: string;
  author: Author2;
  committer: Author2;
  parents: Parent[];
}

interface Parent {
  sha: string;
  url: string;
  html_url: string;
}

interface Author2 {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
}

interface Commit {
  author: Author;
  committer: Author;
  message: string;
  tree: Tree;
  url: string;
  comment_count: number;
  verification: Verification;
}

interface Verification {
  verified: boolean;
  reason: string;
  signature: null;
  payload: null;
  verified_at: null;
}

interface Tree {
  sha: string;
  url: string;
}

interface Author {
  name: string;
  email: string;
  date: string;
}
fetch("https://api.github.com/repos/ssvlabs/ssv-web/pulls")
  .then((res) => {
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    console.log("✅ PR Title:", data.title);
    console.log("🔗 Commits URL:", data.commits_url);

    // Now fetch commits
    return fetch(data.commits_url);
  })
  .then((res) => /** @type {Promise<CommitRoot[]>} */ (res.json()))
  .then((commits) => {
    console.log(`📝 ${commits.length} Commits:`);
    const commitMessages = commits
      .map((commit) => {
        return commit.commit.message.split("\n");
      })
      .flat();
    const regex = /\b\d{10}\b/;
    console.log("commitMessages:", commitMessages);
    const commitsWithMondayTicketID = commitMessages.reduce((/** @type {string[]} */ acc, message) => {
      if (regex.test(message)) {
        acc.push(message);
      }
      return acc;
    }, []);
    console.log("commitsWithMondayTicketID:", commitsWithMondayTicketID);
  });
