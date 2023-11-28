import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import config from '~app/common/config';
import { getImage } from '~lib/utils/filePath';
import { NETWORKS, TOKEN_NAMES } from '~lib/utils/envHelper';

export const initOnboard = () => {
  const injected = injectedModule();
  const walletConnect = walletConnectModule({ dappUrl: 'https://app.ssv.network/', projectId: config.ONBOARD.PROJECT_ID, optionalChains: [NETWORKS.MAINNET, NETWORKS.GOERLI, NETWORKS.HOLESKY] });
  const theme = window.localStorage.getItem('isDarkMode') === '1' ? 'dark' : 'light';

  return Onboard({
    theme: theme,
    apiKey: config.ONBOARD.API_KEY,
    wallets: [injected, walletConnect],
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
        token: TOKEN_NAMES[NETWORKS.MAINNET],
        label: 'Ethereum Mainnet',
      },
      {
        id: NETWORKS.GOERLI,
        token: TOKEN_NAMES[NETWORKS.GOERLI],
        label: 'Goerli testnet',
      },
      {
        id: NETWORKS.HOLESKY,
        label: 'Holesky testnet',
        token: TOKEN_NAMES[NETWORKS.HOLESKY],
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
  });
};
