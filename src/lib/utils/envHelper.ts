/**
 * TODO: remove this file entirely
 */

import { getStoredNetwork } from '~root/providers/networkInfo.provider';

export interface IENVS {
  NETWORK: string,
  BEACONCHA_URL: string,
  LAUNCHPAD_URL: string,
  ETHERSCAN_URL: string,
  INSUFFICIENT_BALANCE_URL: string,
}

export type NetworkDataType = {
  api: string;
  logo: string;
  networkId: number;
  faucetApi: string;
  apiVersion: string;
  apiNetwork: string;
  optionLabel: string;
  activeLabel: string;
  contractToken: string;
  getterContractAddress: string;
  setterContractAddress: string;
  insufficientBalanceUrl: string;
};

type NetworkDataFromEnvironmentType = Pick<NetworkDataType, 'networkId'
  | 'api'
  | 'apiVersion'
  | 'apiNetwork'
  | 'contractToken'
  | 'setterContractAddress'
  | 'insufficientBalanceUrl'
  | 'getterContractAddress'>;

// TODO: remove
export const MAINNET_NETWORK_ID = 1;
export const GOERLI_NETWORK_ID = 5;
export const HOLESKY_NETWORK_ID = 17000;

export const NETWORKS = {
  MAINNET: MAINNET_NETWORK_ID,
  GOERLI: GOERLI_NETWORK_ID,
  HOLESKY: HOLESKY_NETWORK_ID,
};

export const TOKEN_NAMES = {
  [NETWORKS.MAINNET]: 'ETH',
  [NETWORKS.GOERLI]: 'GoerliETH',
  [NETWORKS.HOLESKY]: 'ETH',
};

export const NETWORK_NAMES = {
  [NETWORKS.MAINNET]: 'Mainnet',
  [NETWORKS.GOERLI]: 'Goerli',
  [NETWORKS.HOLESKY]: 'Holesky',
};

export const testNets = [GOERLI_NETWORK_ID, HOLESKY_NETWORK_ID];


/**
 * Check if network is in list of other networks
 * @param network number or hex representation string
 * @param networks array of numbers or hex representation strings
 */
export const inNetworks = (network: string | number, networks: string[] | number[]): boolean => {
  return getNetworkIndex(network, networks) !== -1;
};

/**
 * Return network index in list of networks
 * @param network number or hex representation string
 * @param networks array of numbers or hex representation strings
 */
export const getNetworkIndex = (network: string | number, networks: string[] | number[]): number => {
  return getHexNetworks(networks).indexOf(toHexString(network));
};

/**
 * Return hex representation strings for given list of networks
 * @param networks numbers or hex representation strings array
 */
export const getHexNetworks = (networks: string[] | number[]): string[] => {
  return networks.map((n: string | number) => {
    return toHexString(n).toLowerCase();
  });
};

const _envs = {
  [NETWORKS.GOERLI]: {
    NETWORK: 'prater',
    BEACONCHA_URL: 'https://prater.beaconcha.in',
    LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://goerli.etherscan.io',
    INSUFFICIENT_BALANCE_URL: getStoredNetwork().insufficientBalanceUrl,
  },
  [NETWORKS.HOLESKY]: {
    NETWORK: 'holesky',
    BEACONCHA_URL: 'https://holesky.beaconcha.in',
    LAUNCHPAD_URL: 'https://holesky.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://holesky.etherscan.io',
    INSUFFICIENT_BALANCE_URL: getStoredNetwork().insufficientBalanceUrl,
  },
  [NETWORKS.MAINNET]: {
    NETWORK: 'mainnet',
    BEACONCHA_URL: 'https://beaconcha.in',
    LAUNCHPAD_URL: 'https://launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://etherscan.io',
    INSUFFICIENT_BALANCE_URL: getStoredNetwork().insufficientBalanceUrl,
  },
};

export const ENV = (): IENVS => {
  const finalNetworkId = getStoredNetwork().networkId;
  return _envs[parseInt(String(finalNetworkId), 10)];
};

export const transactionLink = (txHash: string) => `${ENV().ETHERSCAN_URL}/tx/${txHash}`;

const toHexString = (val: any) => typeof val === 'number' ? `0x${val.toString(16)}` : val;

export const currentNetworkName = () => NETWORK_NAMES[getStoredNetwork().networkId];

export const isMainnet = getStoredNetwork().networkId === NETWORKS.MAINNET;

export const networkTitle = isMainnet ? 'Mainnet' : 'Testnet';

