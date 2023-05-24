
export interface IENVS {
  BEACONCHA_URL: string,
  LAUNCHPAD_URL: string,
  ETHERSCAN_URL: string,
  NETWORK: string,
}

export type NetworkData = {
    networkId: string;
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

const data = process.env.REACT_APP_SSV_NETWORKS;

console.log({ env: process.env });
export const NETWORKS_DATA = data ? JSON.parse(data) : null;

const _envs = {
    [NETWORKS.MAINNET]: {
        BEACONCHA_URL: 'https://prater.beaconcha.in',
        LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
        ETHERSCAN_URL: 'https://goerli.etherscan.io',
        NETWORK: 'mainnet',
    },
    [NETWORKS.GOERLI]: {
        BEACONCHA_URL: 'https://prater.beaconcha.in',
        LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
        ETHERSCAN_URL: 'https://goerli.etherscan.io',
        NETWORK: 'prater',
  },
};

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

export const ENV = (): IENVS => {
  const finalNetworkId = process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID;
  return _envs[parseInt(String(finalNetworkId), 10)];
};

export const changeCurrentNetwork = (key: any) => {
    window.localStorage.setItem('current_network', key);
    window.location.reload();
};

export const getCurrentNetwork = () => {
    console.log({ NETWORKS_DATA });
    // if (!NETWORKS_DATA && !process.env.REACT_APP_DISABLE_NETWORK_DATA_CHECK) throw new Error('Provide network data');
    const value = window.localStorage.getItem('current_network');
    if (value && NETWORKS_DATA.length > 1) return NETWORKS_DATA[value];
    window.localStorage.setItem('current_network', '0');
    return NETWORKS_DATA[0];
};
