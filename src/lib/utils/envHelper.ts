

export interface IENVS {
  BEACONCHA_URL: string,
  LAUNCHPAD_URL: string,
  ETHERSCAN_URL: string,
  NETWORK: string,
}

export type NetworkDataType = {
    networkId: number;
    logo: string;
    optionLabel: string;
    activeLabel: string;
    ssvApiEndpoint: string;
    ssvContractAddress: string;
    setterContractAddress: string;
    getterContractAddress: string;
};

export const NETWORKS = {
  MAINNET: 1,
  GOERLI: 5,
};

const NETWORK_VARIABLES =  {
        [NETWORKS.MAINNET]: {
        logo: 'dark',
            activeLabel: 'Ethereum',
            optionLabel: 'Ethereum Mainnet',
    },
        [NETWORKS.GOERLI]: {
        logo: 'light',
            activeLabel: 'Goerli',
            optionLabel: 'Goerli Testnet',
    },
};

const data = process.env.REACT_APP_SSV_NETWORKS;

const fillNetworkData = (network: NetworkDataType, networkId: number) => ({ ...network, ...NETWORK_VARIABLES[networkId] });

export const NETWORKS_DATA = data ? JSON.parse(data).map((network: any) => fillNetworkData(network, network.networkId)) : null;

// This envs should be used with mainnet
// =================================================================
// const _envs = {
//   [NETWORKS.GOERLI]: {
//     BEACONCHA_URL: 'https://prater.beaconcha.in',
//     LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
//     ETHERSCAN_URL: 'https://goerli.etherscan.io',
//     NETWORK: 'prater',
//   },
//   [NETWORKS.MAINNET]: {
//     BEACONCHA_URL: 'https://beaconcha.in',
//     LAUNCHPAD_URL: 'https://launchpad.ethereum.org/en/',
//     ETHERSCAN_URL: 'https://etherscan.io',
//     NETWORK: 'mainnet',
//   },
// };


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

export const changeCurrentNetwork = (networkId: number) => {
    console.log('changeCurrentNetwork');
    const networkIndex = NETWORKS_DATA.findIndex((network: NetworkDataType) => network.networkId === networkId);
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