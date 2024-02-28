import { getFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';

export interface I_ENVS {
  BEACONCHA_URL: string,
  LAUNCHPAD_URL: string,
  ETHERSCAN_URL: string,
  INSUFFICIENT_BALANCE_URL: string,
}

interface NetworkInfo {
  networkId: number;
  api: string;
  apiVersion: string;
  apiNetwork: string;
  faucetApi: string;
  explorerUrl: string;
  googleTagSecret: string;
  tokenAddress: string;
  contractToken: string;
  getterContractAddress: string;
  setterContractAddress: string;
  insufficientBalanceUrl: string;
  distributionContractAddress: string;
}

export const API_VERSIONS = {
  V4: 'v4',
};

export const MAINNET_NETWORK_ID = 1;
export const GOERLI_NETWORK_ID = 5;
export const HOLESKY_NETWORK_ID = 17000;

const NETWORK_NAMES = {
  [`${MAINNET_NETWORK_ID}`]: 'Mainnet',
  [`${GOERLI_NETWORK_ID}`]: 'Goerli',
  [`${HOLESKY_NETWORK_ID}`]: 'Holesky',
};

const NETWORK_VARIABLES = {
  [`${MAINNET_NETWORK_ID}_${API_VERSIONS.V4}`]: {
    logo: 'dark',
    activeLabel: 'Ethereum',
    optionLabel: 'Ethereum Mainnet',
  },
  [`${GOERLI_NETWORK_ID}_${API_VERSIONS.V4}`]: {
    logo: 'light',
    activeLabel: 'Goerli',
    optionLabel: 'Goerli Testnet',
  },
  [`${HOLESKY_NETWORK_ID}_${API_VERSIONS.V4}`]: {
    logo: 'light',
    activeLabel: 'Holesky',
    optionLabel: 'Holesky Testnet',
  },
};

const rawNetworksData: string = process.env.REACT_APP_SSV_NETWORKS as string;
const networks: NetworkInfo[] = JSON.parse(rawNetworksData);

for (let i = 0; i < networks.length; i++) {
  const network = networks[i];
  network.api = `${network.api}/${network.apiVersion}/${network.apiNetwork}`;
  network.faucetApi = `${network.api}/faucet`;
}

const getNetworkInfoIndexByNetworkId = (networkId: number) => {
  return networks.findIndex((network) => network.networkId === networkId);
};

const changeNetwork = (index: number): NetworkInfo => {
  // Get network info from its index in switcher
  if (!networks[index]) {
    index = 0;
  }
  saveInLocalStorage('networkSwitcherIndex', `${index}`);
  console.warn('Saved network index', index);
  return networks[index];
};

const getStoredNetworkIndex = () => Number(getFromLocalStorageByKey('networkSwitcherIndex') || 0);

const getStoredNetwork = () => {
  let savedNetworkIndex = getStoredNetworkIndex();
  if (!networks[savedNetworkIndex]) {
    savedNetworkIndex = 0;
    saveInLocalStorage('networkSwitcherIndex', `${savedNetworkIndex}`);
  }
  return networks[savedNetworkIndex];
};

const isMainnet = () => getStoredNetwork().networkId === MAINNET_NETWORK_ID;

const currentNetworkName = () => NETWORK_NAMES[getStoredNetwork().networkId];

const testNets = [GOERLI_NETWORK_ID, HOLESKY_NETWORK_ID];

const _envs = {
  [`${GOERLI_NETWORK_ID}`]: {
    BEACONCHA_URL: 'https://prater.beaconcha.in',
    LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://goerli.etherscan.io',
    INSUFFICIENT_BALANCE_URL: getStoredNetwork().insufficientBalanceUrl,
  },
  [`${HOLESKY_NETWORK_ID}`]: {
    BEACONCHA_URL: 'https://holesky.beaconcha.in',
    LAUNCHPAD_URL: 'https://holesky.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://holesky.etherscan.io',
    INSUFFICIENT_BALANCE_URL: getStoredNetwork().insufficientBalanceUrl,
  },
  [`${MAINNET_NETWORK_ID}`]: {
    BEACONCHA_URL: 'https://beaconcha.in',
    LAUNCHPAD_URL: 'https://launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://etherscan.io',
    INSUFFICIENT_BALANCE_URL: getStoredNetwork().insufficientBalanceUrl,
  },
};

// TODO: refactor
const getLinks = (): I_ENVS => {
  const finalNetworkId = getStoredNetwork().networkId;
  return _envs[parseInt(String(finalNetworkId), 10)];
};

const getTransactionLink = (txHash: string) => `${getLinks().ETHERSCAN_URL}/tx/${txHash}`;

export {
  NETWORK_VARIABLES,
  NetworkInfo,
  networks,
  getNetworkInfoIndexByNetworkId,
  changeNetwork,
  getStoredNetwork,
  getStoredNetworkIndex,
  isMainnet,
  currentNetworkName,
  getLinks,
  testNets,
  getTransactionLink,
};
