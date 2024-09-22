/* eslint-disable no-undef */
/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        npmPublish: false, // Do not publish to npm
        pkgRoot: ".", // Path to package.json
      },
    ],
    "@semantic-release/git",
    "@semantic-release/github",
  ],
};
