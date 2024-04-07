import safeWallet from '@web3-onboard/gnosis';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import config from '~app/common/config';
import { Theme } from '@web3-onboard/core';
import { clearLocalStorage, getFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';
import { HOLESKY_RPC_URL, MAINNET_RPC_URL } from '~app/common/config/config';
import { MAINNET_NETWORK_ID, HOLESKY_NETWORK_ID } from '~root/providers/networkInfo.provider';

const TOKEN_NAMES = {
  [`${MAINNET_NETWORK_ID}`]: 'ETH',
  [`${HOLESKY_NETWORK_ID}`]: 'ETH',
};

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
  optionalChains: [MAINNET_NETWORK_ID, HOLESKY_NETWORK_ID],
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
      id: MAINNET_NETWORK_ID,
      label: 'Ethereum Mainnet',
      token: TOKEN_NAMES[`${MAINNET_NETWORK_ID}`],
      rpcUrl: MAINNET_RPC_URL,
    },
    {
      id: HOLESKY_NETWORK_ID,
      label: 'Holesky',
      token: TOKEN_NAMES[`${HOLESKY_NETWORK_ID}`],
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
    icon: '/images/ssvIcons/logo.svg',
    logo: '/images/ssvIcons/logo.svg',
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
