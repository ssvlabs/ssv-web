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

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const generateNewMnemonic = () => {
  const cliFolder = path.join(
    process.cwd(),
    'cypress',
    'integration',
    'ssv',
    'cli',
  );
  const cliExecutablePath = path.join(
    cliFolder,
    'deposit.sh',
  );
  execSync(cliExecutablePath);
  const validatorKeysFolder = path.join(cliFolder, 'validator_keys');
  const dirCont = fs.readdirSync(validatorKeysFolder);
  const files = dirCont.filter((elm) => {
    return elm.match(/(keystore).*/ig);
  });
  if (files.length) {
    const keystoreFilePath = path.join(validatorKeysFolder, files[0]);
    return fs.readFileSync(keystoreFilePath).toString();
  }
  return '{}';
};

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  const metaMaskPluginPath = path.join(process.cwd(), 'cypress', 'plugins', 'MetaMask', 'metamask-chrome-9.5.0');

  on('before:browser:launch', (browser, launchOptions) => {
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
  });

  on('task', {
    generateNewMnemonic,
  });
};
