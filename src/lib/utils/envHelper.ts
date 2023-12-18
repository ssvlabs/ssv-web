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

const FIRST_NETWORK_INDEX = 0;

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

export const API_VERSIONS = {
  V3: 'v3',  // TODO: cleanup from v3
  V4: 'v4',
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

const data = process.env.REACT_APP_SSV_NETWORKS;

const fillNetworkData = (network: NetworkDataFromEnvironmentType, networkId: number, apiVersion: string): NetworkDataType => ({
  ...network, ...NETWORK_VARIABLES[`${networkId}_${apiVersion}`],
  api: `${network.api}/${network.apiVersion}/${network.apiNetwork}`,
  faucetApi: `${network.api}/faucet`,
});

export const NETWORKS_DATA = data ? JSON.parse(data).map((network: NetworkDataFromEnvironmentType) => fillNetworkData(network, network.networkId, network.apiVersion)) : null;

/**
 * Stores the given network index in local storage and retrieves the corresponding network configuration.
 * @param {number} index - The index of the network to store and retrieve.
 * @returns The network configuration object.
 */
const storeAndRetrieveNetwork = (index: number) => {
  window.localStorage.setItem('current_network', index.toString());
  const network = NETWORKS_DATA[index];
  return { ...network, ...NETWORK_VARIABLES[network.networkId] };
};

/**
 * Retrieves the current network configuration.
 * Throws an error if network data is not provided and network data checks are enabled.
 * Selects the network based on the stored index, defaults to a specific network for faucet pages,
 * or defaults to the first network if no index is found.
 */
export const getCurrentNetwork = () => {
  // Validate network data availability
  if (!NETWORKS_DATA && !process.env.REACT_APP_DISABLE_NETWORK_DATA_CHECK) {
    throw new Error('Network data is required but not provided.');
  }

  let networkIndex: string | number | null = window.localStorage.getItem('current_network');

  // Convert the network index from string to number if it exists
  networkIndex = networkIndex ? Number(networkIndex) : null;

  // Determine the network index based on conditions
  if (!networkIndex) {
    if (process.env.REACT_APP_FAUCET_PAGE) {
      // Default to a specific network for faucet apps without a stored network index
      networkIndex = NETWORKS_DATA.findIndex((network: NetworkDataType) => network.networkId === NETWORKS.HOLESKY);
    } else {
      // Default to the first network if no index is found
      networkIndex = FIRST_NETWORK_INDEX;
    }
  } else if (!NETWORKS_DATA[networkIndex] || NETWORKS_DATA.length <= 1) {
    // Fall back to the first network if the stored index is invalid or there is only one network
    networkIndex = FIRST_NETWORK_INDEX;
  }

  // Retrieve and return the network configuration using the determined index
  return storeAndRetrieveNetwork(Number(networkIndex));
};

const _envs = {
  [NETWORKS.GOERLI]: {
    NETWORK: 'prater',
    BEACONCHA_URL: 'https://prater.beaconcha.in',
    LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://goerli.etherscan.io',
    INSUFFICIENT_BALANCE_URL: getCurrentNetwork().insufficientBalanceUrl,
  },
  [NETWORKS.HOLESKY]: {
    NETWORK: 'holesky',
    BEACONCHA_URL: 'https://holesky.beaconcha.in',
    LAUNCHPAD_URL: 'https://holesky.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://holesky.etherscan.io',
    INSUFFICIENT_BALANCE_URL: getCurrentNetwork().insufficientBalanceUrl,
  },
  [NETWORKS.MAINNET]: {
    NETWORK: 'mainnet',
    BEACONCHA_URL: 'https://beaconcha.in',
    LAUNCHPAD_URL: 'https://launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://etherscan.io',
    INSUFFICIENT_BALANCE_URL: getCurrentNetwork().insufficientBalanceUrl,
  },
};

export const ENV = (): IENVS => {
  const finalNetworkId = getCurrentNetwork().networkId;
  return _envs[parseInt(String(finalNetworkId), 10)];
};

export const transactionLink = (txHash: string) => `${ENV().ETHERSCAN_URL}/tx/${txHash}`;

export const toHexString = (val: any) => typeof val === 'number' ? `0x${val.toString(16)}` : val;

export const changeCurrentNetwork = (networkId: number, version?: string) => {
  // Find already persisted network index in supported networks list
  const value = window.localStorage.getItem('current_network');
  const networkIdHex = toHexString(networkId).toLowerCase();
  const networkIndex = NETWORKS_DATA.findIndex((network: NetworkDataType) => {
    const chainIdHex = toHexString(network.networkId).toLowerCase();
    if (version) {
      return networkIdHex === chainIdHex && network.apiVersion === version;
    } else {
      return networkIdHex === chainIdHex;
    }
  });
  if (networkIndex === -1) {
    throw new Error(`Network with ID:${networkId} is not found in supported networks`);
  }
  if (Number(value) === networkIndex) return;
  window.localStorage.setItem('current_network', String(networkIndex));
  // if (walletConnected && !JSON.parse(walletConnected)) {
    window.location.reload();
  // }
};

export const currentNetworkName = () => NETWORK_NAMES[getCurrentNetwork().networkId];

export const isMainnet = getCurrentNetwork().networkId === NETWORKS.MAINNET;

export const networkTitle = isMainnet ? 'Mainnet' : 'Testnet';

export const notIncludeMainnet = NETWORKS_DATA.every((network: NetworkDataType) => {
  return toHexString(network.networkId).toLowerCase() !== '0x1';
});
