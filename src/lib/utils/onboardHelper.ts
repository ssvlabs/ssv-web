import Onboard, { InitOptions, OnboardAPI } from '@web3-onboard/core';
import safeWallet from '@web3-onboard/gnosis';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import { NETWORKS, TOKEN_NAMES } from '~lib/utils/envHelper';

export const cleanLocalStorage = () => {
  const locationRestrictionDisabled = window.localStorage.getItem('locationRestrictionDisabled');
  const currentNetwork = window.localStorage.getItem('current_network');
  window.localStorage.clear();
  if (locationRestrictionDisabled) {
    window.localStorage.setItem('locationRestrictionDisabled', '1');
  }
  if (currentNetwork) {
    window.localStorage.setItem('current_network', currentNetwork);
  }
};

const injected = injectedModule();
const walletConnect = walletConnectModule({
  dappUrl: window.location.origin,
  projectId: config.ONBOARD.PROJECT_ID,
  optionalChains: [NETWORKS.MAINNET, NETWORKS.GOERLI, NETWORKS.HOLESKY],
});
const safeWalletInstance = safeWallet();

const initOnboardOptions = () => {
  const theme = window.localStorage.getItem('isDarkMode') === '1' ? 'dark' : 'light';
};

const tmp = {
  apiKey: config.ONBOARD.API_KEY,
  wallets: [
    injected,
    walletConnect,
    safeWalletInstance,
  ],
  disableFontDownload: true,
  connect: {
    autoConnectLastWallet: true,
    removeIDontHaveAWalletInfoLink: true,
    removeWhereIsMyWalletWarning: true,
  },
  notify: {
    enabled: false,
  },
  accountCenter: {
    mobile: {
      enabled: false,
    },
    desktop: {
      enabled: false,
    },
  },
  chains: [
    {
      id: NETWORKS.MAINNET,
      label: 'Ethereum Mainnet',
      token: TOKEN_NAMES[NETWORKS.MAINNET],
    },
    {
      id: NETWORKS.GOERLI,
      label: 'Goerli testnet',
      token: TOKEN_NAMES[NETWORKS.GOERLI],
    },
    {
      id: 17000,
      label: 'Holesky',
      token: 'ETH',
      rpcUrl: 'https://cool-prettiest-daylight.ethereum-holesky.quiknode.pro/0d8ffe59dc7865022b15bc0d56692593416330ab/',
      // rpcUrl: 'https://rpc.holesky.ethpandaops.io',
      // publicRpcUrl: 'https://rpc.holesky.ethpandaops.io',
      // rpcUrl: 'https://ethereum-holesky.publicnode.com',
      // publicRpcUrl: 'https://ethereum-holesky.publicnode.com',
      // rpcUrl: 'https://newest-fragrant-sponge.ethereum-holesky.quiknode.pro/626e253896d20dd8a3cf447cb286c3fc1755f511/',
      // publicRpcUrl: 'https://newest-fragrant-sponge.ethereum-holesky.quiknode.pro/626e253896d20dd8a3cf447cb286c3fc1755f511/',
      // rpcUrl: 'https://operators-holesky.testnet.fi/api/rpc?chainId=17000',
      // publicRpcUrl: 'https://operators-holesky.testnet.fi/api/rpc?chainId=17000',
      // rpcUrl: window.localStorage.getItem('rpcUrl') || undefined,
      // publicRpcUrl: window.localStorage.getItem('publicRpcUrl') || undefined,
    },
  ],
  appMetadata: {
    name: 'SSV Network',
    icon: getImage('ssvIcons/logo.svg'),
    logo: getImage('ssvIcons/logo.svg'),
    description: 'SSV Network',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
    ],
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://ssv.network/terms-of-use/',
      privacyUrl: 'https://ssv.network/privacy-policy/',
    },
  },
};

// OLD
// const initOnboard = (): OnboardAPI => {
//   return Onboard(initOnboardOptions() as InitOptions);
// };

export {
  initOnboardOptions,
  // initOnboard,
  tmp,
};
