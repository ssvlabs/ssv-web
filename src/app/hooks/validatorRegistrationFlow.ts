/**
 * Temporary implementation to have different routing flow per network and env.
 * Usage:
 *
 * const { getNextNavigation } = validatorRegistrationFlow(config.routes.SSV.....); Call with your current location
 *
 * const nextRoute = getNextNavigation(EValidatorFlowAction.ADD_CLUSTER); Call getNextNavigation with the action.
 * navigate(nextRoute);
 * */


import config from '~app/common/config';
import { useSetChain } from '@web3-onboard/react';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { NETWORKS } from '~lib/utils/envHelper';

//General -  Mainnet/Testnet --> Single/Multi --> chainId --> route mapping?
// Now:
// Mainnet - will always single(old route mapping)
// other - always new.

type NavigationRoutes = {
  [mode in EBulkMode]: Record<string, string | Record<number, string>>;
};

enum EBulkMode {
  SINGLE,
  MULTI,
}

export enum EValidatorFlowAction {
  ADD_CLUSTER,
  GENERATE_NEW_SHARE,
  ALREADY_HAVE_SHARES,
}

const NETWORK_TO_BULK_MODE = {
  [NETWORKS.MAINNET]: EBulkMode.SINGLE,
  [NETWORKS.HOLESKY]: EBulkMode.MULTI,
  [NETWORKS.GOERLI]: EBulkMode.MULTI,
};

const BULK_MODE_TO_ROUTES: NavigationRoutes = {
  [EBulkMode.SINGLE]: {},
  [EBulkMode.MULTI]: {
    [config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT]: config.routes.SSV.VALIDATOR.HOME,
    [config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD]: { [EValidatorFlowAction.ADD_CLUSTER]: config.routes.SSV.VALIDATOR.HOME },
    [config.routes.SSV.VALIDATOR.HOME]: {
      [EValidatorFlowAction.GENERATE_NEW_SHARE]: config.routes.SSV.VALIDATOR.SELECT_OPERATORS,
      [EValidatorFlowAction.ALREADY_HAVE_SHARES]: config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES,
    },

  },
};

const validatorRegistrationFlow = (currentRoute: string) => {
  const [{ connectedChain }] = useSetChain();

  const getCurrentNetwork = (): number => {
    return connectedChain?.id !== null ? Number(connectedChain!.id) : getStoredNetwork().networkId;
  };

  const getNextNavigation = (action?: EValidatorFlowAction): string => {
    const currentNetwork: number = getCurrentNetwork();

    const currentBulkMode = NETWORK_TO_BULK_MODE[currentNetwork];
    const routeMappings = BULK_MODE_TO_ROUTES[currentBulkMode];
    const nextAvailableRoutes = routeMappings[currentRoute];
    let nextRoute = nextAvailableRoutes;
    if (action !== undefined) {
      nextRoute = nextAvailableRoutes[action];
    }
    // @ts-ignore
    return nextRoute;
  };

  return { getNextNavigation };
};

export default validatorRegistrationFlow;
