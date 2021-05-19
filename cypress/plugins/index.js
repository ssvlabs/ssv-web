/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
import * as path from 'path';
import { getSigners, getKeyStoreData, liftLocalNetworkNode } from './tasks';

/**
 * Browser launched hook
 * @param browser
 * @param launchOptions
 * @returns {*}
 */
const onBrowserLaunch = (browser, launchOptions) => {
  const metaMaskPluginPath = path.join(process.cwd(), 'cypress', 'plugins', 'MetaMask', 'metamask-chrome-9.5.0');
  if (browser.family === 'chromium' && browser.name !== 'electron') {
    launchOptions.extensions.push(metaMaskPluginPath);
  }
  if (browser.family === 'chromium' && browser.name !== 'electron') {
    // auto open devtools
    launchOptions.args.push('--auto-open-devtools-for-tabs');
  }
  if (browser.family === 'firefox') {
    // auto open devtools
    launchOptions.args.push('-devtools');
  }
  return launchOptions;
};

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  // Hooks
  on('before:browser:launch', onBrowserLaunch);

  // Tasks
  on('task', {
    getSigners,
    getKeyStoreData,
    liftLocalNetworkNode,
  });
};
