import config from '~app/common/config';

/**
 * Checks if the page is upgrade from CDT to SSV token.
 */
export const isUpgradePage = () => {
  return window.location.pathname.startsWith(config.routes.UPGRADE);
};
