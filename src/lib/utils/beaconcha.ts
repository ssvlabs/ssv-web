export const NETWORKS = {
  MAINNET: 1,
  GOERLI: 5,
};

/**
 * If network Id is passed to the function from MetaMask it will be used first
 * Otherwise old behavior
 * @param networkId
 */
export const getBaseBeaconchaUrl = (networkId?: number) => {
  const finalNetworkId = networkId ?? process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID;
  switch (parseInt(String(finalNetworkId), 10)) {
    case NETWORKS.GOERLI:
      return 'https://pyrmont.beaconcha.in';
    case NETWORKS.MAINNET:
      return 'https://beaconcha.in';
  }
};
