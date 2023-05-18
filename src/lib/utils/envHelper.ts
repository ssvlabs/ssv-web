export interface IENVS {
  BEACONCHA_URL: string,
  LAUNCHPAD_URL: string,
  ETHERSCAN_URL: string,
  NETWORK: string,
}

export const NETWORKS = {
  MAINNET: 1,
  GOERLI: 5,
};

const _envs = {
  [NETWORKS.GOERLI]: {
    BEACONCHA_URL: 'https://prater.beaconcha.in',
    LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://goerli.etherscan.io',
    NETWORK: 'prater',
  },
  [NETWORKS.MAINNET]: {
    BEACONCHA_URL: 'https://beaconcha.in',
    LAUNCHPAD_URL: 'https://launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://etherscan.io',
    NETWORK: 'mainnet',
  },
};

export const ENV = (): IENVS => {
  const finalNetworkId = process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID;
  return _envs[parseInt(String(finalNetworkId), 10)];
};
