import { getFromLocalStorageByKey, saveInLocalStorage } from '~root/providers/localStorage.provider';
import { NetworksEnum } from '~app/enums/networks.enum';

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
export const HOLESKY_NETWORK_ID = 17000;

const NETWORK_NAMES = {
  [`${MAINNET_NETWORK_ID}`]: 'Mainnet',
  [`${HOLESKY_NETWORK_ID}`]: 'Holesky',
};

const LINKS = {
  [`${HOLESKY_NETWORK_ID}`]: {
    [NetworksEnum.BEACONCHA_URL]: 'https://holesky.beaconcha.in',
    [NetworksEnum.LAUNCHPAD_URL]: 'https://holesky.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://holesky.etherscan.io',
  },
  [`${MAINNET_NETWORK_ID}`]: {
    [NetworksEnum.BEACONCHA_URL]: 'https://beaconcha.in',
    [NetworksEnum.LAUNCHPAD_URL]: 'https://launchpad.ethereum.org/en/',
    [NetworksEnum.ETHERSCAN_URL]: 'https://etherscan.io',
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

const currentNetworkName = () => NETWORK_NAMES[getStoredNetwork().networkId];

const testNets = [HOLESKY_NETWORK_ID];

const getLink = ({ type }: { type: NetworksEnum }) => LINKS[`${getStoredNetwork().networkId}`][type];

const getBeaconChainLink = () => LINKS[`${getStoredNetwork().networkId}`][NetworksEnum.BEACONCHA_URL];

const getLaunchpadLink = () => LINKS[`${getStoredNetwork().networkId}`][NetworksEnum.LAUNCHPAD_URL];

const getEtherScanLink = () => LINKS[`${getStoredNetwork().networkId}`][NetworksEnum.ETHERSCAN_URL];

const getTransactionLink = (txHash: string) => `${getLink({ type: NetworksEnum.ETHERSCAN_URL })}/tx/${txHash}`;

export {
  LINKS,
  NetworkInfo,
  networks,
  getNetworkInfoIndexByNetworkId,
  changeNetwork,
  getStoredNetwork,
  getStoredNetworkIndex,
  currentNetworkName,
  testNets,
  getLink,
  getBeaconChainLink,
  getLaunchpadLink,
  getEtherScanLink,
  getTransactionLink,
};
