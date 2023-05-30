export interface IENVS {
    NETWORK: string,
    BEACONCHA_URL: string,
    LAUNCHPAD_URL: string,
    ETHERSCAN_URL: string,
}

export type NetworkDataType = {
    logo: string;
    networkId: number;
    optionLabel: string;
    activeLabel: string;
    api: string;
    contractToken: string;
    setterContractAddress: string;
    getterContractAddress: string;
    apiVersion: string;
    apiNetwork: string;
};

type NetworkDataFromEnvironmentType = Pick<NetworkDataType, 'networkId'
    | 'api'
    | 'apiVersion'
    | 'apiNetwork'
    | 'contractToken'
    | 'setterContractAddress'
    | 'getterContractAddress'>;

export const NETWORKS = {
  MAINNET: 1,
  GOERLI: 5,
};

export const API_VERSIONS = {
    V3: 'v3',
    V4: 'v4',
};

const NETWORK_VARIABLES =  {
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
};

const data = process.env.REACT_APP_SSV_NETWORKS;

const fillNetworkData = (network: NetworkDataFromEnvironmentType, networkId: number, apiVersion: string): NetworkDataType => ({ ...network, ...NETWORK_VARIABLES[`${networkId}_${apiVersion}`], api: `${network.api}/${network.apiVersion}/${network.apiNetwork}` });

export const NETWORKS_DATA = data ? JSON.parse(data).map((network: NetworkDataFromEnvironmentType) => fillNetworkData(network, network.networkId, network.apiVersion)) : null;


const _envs = {
  [NETWORKS.GOERLI]: {
      NETWORK: 'prater',
      BEACONCHA_URL: 'https://prater.beaconcha.in',
      LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
      ETHERSCAN_URL: 'https://goerli.etherscan.io',
  },
  [NETWORKS.MAINNET]: {
      NETWORK: 'mainnet',
      BEACONCHA_URL: 'https://beaconcha.in',
      LAUNCHPAD_URL: 'https://launchpad.ethereum.org/en/',
      ETHERSCAN_URL: 'https://etherscan.io',
  },
};

export const ENV = (): IENVS => {
  const finalNetworkId = getCurrentNetwork().networkId;
  return _envs[parseInt(String(finalNetworkId), 10)];
};

export const switchNetwork = (networkId: number, version: string) => {
    window.localStorage.setItem('SWITCHED_BY_TOGGLE', 'true');
    changeCurrentNetwork(networkId, version, true);
};

export const changeCurrentNetwork = (networkId: number, version?: string, skipToggleFlag?: boolean) => {
    const toggleFlag = window.localStorage.getItem('SWITCHED_BY_TOGGLE');
    const parsedToggleFlag = toggleFlag ? JSON.parse(toggleFlag) : false;
    if (parsedToggleFlag && !skipToggleFlag) {
        console.log(networkId);
        window.localStorage.setItem('SWITCHED_BY_TOGGLE', 'false');
        return;
    }
    const value = window.localStorage.getItem('current_network');
    const networkIndex = NETWORKS_DATA.findIndex((network: NetworkDataType) => {
        if (version) {
            return network.networkId === networkId && network.apiVersion === version;
        } else {
            return network.networkId === networkId;
        }
    });
    if (Number(value) === networkIndex ) return;
    window.localStorage.setItem('current_network', networkIndex);
    window.location.reload();
};

export const getCurrentNetwork = () => {
    if (!NETWORKS_DATA && !process.env.REACT_APP_DISABLE_NETWORK_DATA_CHECK) throw new Error('Provide network data');
    const value = window.localStorage.getItem('current_network');
    if (value && NETWORKS_DATA.length > 1) {
        const networkId = NETWORKS_DATA[value].networkId;
        return { ...NETWORKS_DATA[value], ...NETWORK_VARIABLES[networkId] };
    }
    window.localStorage.setItem('current_network', '0');
    const networkId = NETWORKS_DATA[0].networkId;
    return { ...NETWORKS_DATA[0], ...NETWORK_VARIABLES[networkId] };
};