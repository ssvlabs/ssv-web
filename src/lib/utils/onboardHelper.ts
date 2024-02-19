import safeWallet from '@web3-onboard/gnosis';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import { NETWORKS, TOKEN_NAMES } from '~lib/utils/envHelper';
import { Theme } from '@web3-onboard/core';
import { clearLocalStorage, getFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';

const GOERLI_RPC_URL = 'https://long-rough-season.ethereum-goerli.quiknode.pro/3f90b8bb4aaea263621f2522b6b9ae240c09c7c6';
const HOLESKY_RPC_URL = 'https://late-thrilling-arm.ethereum-holesky.quiknode.pro/b64c32d5e1b1664b4ed2de4faef610d2cf08ed26';

export const cleanLocalStorageAndCookie = () => {
  const locationRestrictionDisabled = getFromLocalStorageByKey('locationRestrictionDisabled');
  const currentNetwork = getFromLocalStorageByKey('networkSwitcherIndex');
  const isDarkMode = getFromLocalStorageByKey('isDarkMode');
  clearLocalStorage();
  document.cookie.split(';').forEach((c) => {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${  new Date(0).toUTCString()  };path=/`);
  });
  if (locationRestrictionDisabled !== null) {
    saveInLocalStorage('locationRestrictionDisabled', '1');
  }
  if (currentNetwork !== null) {
    saveInLocalStorage('networkSwitcherIndex', currentNetwork);
  }
  if (isDarkMode !== null) {
    saveInLocalStorage('isDarkMode', isDarkMode);
  }
};

const injected = injectedModule();
const walletConnect = walletConnectModule({
  dappUrl: window.location.origin,
  projectId: config.ONBOARD.PROJECT_ID,
  optionalChains: [Number(NETWORKS.MAINNET), Number(NETWORKS.GOERLI), Number(NETWORKS.HOLESKY)],
});
const safeWalletInstance = safeWallet();

const initOnboardOptions = {
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
      rpcUrl: GOERLI_RPC_URL,
    },
    {
      id: NETWORKS.HOLESKY,
      label: 'Holesky',
      token: 'ETH',
      rpcUrl: HOLESKY_RPC_URL,
      // rpcUrl: 'https://rpc.holesky.ethpandaops.io',
      // publicRpcUrl: 'https://rpc.holesky.ethpandaops.io',
      // rpcUrl: 'https://ethereum-holesky.publicnode.com',
      // publicRpcUrl: 'https://ethereum-holesky.publicnode.com',
      // rpcUrl: 'https://newest-fragrant-sponge.ethereum-holesky.quiknode.pro/626e253896d20dd8a3cf447cb286c3fc1755f511/',
      // publicRpcUrl: 'https://newest-fragrant-sponge.ethereum-holesky.quiknode.pro/626e253896d20dd8a3cf447cb286c3fc1755f511/',
      // rpcUrl: 'https://operators-holesky.testnet.fi/api/rpc?chainId=17000',
      // publicRpcUrl: 'https://operators-holesky.testnet.fi/api/rpc?chainId=17000',
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
  theme: (getFromLocalStorageByKey('isDarkMode') === '1' ? 'dark' : 'light') as Theme,
};

export { initOnboardOptions };
