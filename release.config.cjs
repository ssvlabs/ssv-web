/* eslint-disable no-undef */
/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: [
    "main",
    { name: "stage", prerelease: true },
    { name: "prod-test", prerelease: true },
    { name: "ilya-dev", prerelease: true },
    { name: "chris-dev", prerelease: true },
    { name: "dima-dev", prerelease: true },
    { name: "sumbat-dev", prerelease: true },
  ],
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
    // "@semantic-release/git",
    // "@semantic-release/github",
  ],
};
