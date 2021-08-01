/**
 * Checks if the page is upgrade from CDT to SSV token.
 */
export const isUpgradePage = () => {
  const hostName = window.location.hostname;
  const upgradePageHostnames = ['local.upgrade.ssv.network', 'upgrade.ssv.network'];
  if (upgradePageHostnames.indexOf(hostName) !== -1) {
    return true;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get('page') === 'upgrade';
};
