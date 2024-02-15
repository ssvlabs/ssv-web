import { getFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';

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

const toHexString = (val: any) => typeof val === 'number' ? `0x${val.toString(16)}` : val;

export const MAINNET_NETWORK_ID = 1;
export const GOERLI_NETWORK_ID = 5;
export const HOLESKY_NETWORK_ID = 17000;

export const NETWORKS = {
  MAINNET: MAINNET_NETWORK_ID,
  GOERLI: GOERLI_NETWORK_ID,
  HOLESKY: HOLESKY_NETWORK_ID,
};

const NETWORK_VARIABLES = {
  [`${NETWORKS.MAINNET}_${API_VERSIONS.V4}`]: {
    logo: 'dark',
    activeLabel: 'Ethereum',
    optionLabel: 'Ethereum Mainnet',
  },
  [`${NETWORKS.GOERLI}_${API_VERSIONS.V4}`]: {
    logo: 'light',
    activeLabel: 'Goerli',
    optionLabel: 'Goerli Testnet',
  },
  [`${NETWORKS.HOLESKY}_${API_VERSIONS.V4}`]: {
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

const isMainnetSupported = () => {
  return networks.findIndex((network) => toHexString(network.networkId).toLowerCase() !== '0x1') !== -1;
};

export {
  NETWORK_VARIABLES,
  NetworkInfo,
  networks,
  toHexString,
  getNetworkInfoIndexByNetworkId,
  changeNetwork,
  getStoredNetwork,
  getStoredNetworkIndex,
  isMainnetSupported,
};
