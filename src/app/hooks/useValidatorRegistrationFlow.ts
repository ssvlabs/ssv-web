/**
 * Temporary implementation to have different routing flow per network and env.
 * Usage:
 *
 * import { useLocation } from 'react-router-dom';
 * const location = useLocation();
 * const { getNextNavigation } = validatorRegistrationFlow(location.pathName); Call with your current location
 *
 * const nextRoute = getNextNavigation(EValidatorFlowAction.ADD_CLUSTER); Call getNextNavigation with the action (if there are multiple options.)
 * navigate(nextRoute);
 * */

import config from '~app/common/config';
import {
  getStoredNetwork,
  MAINNET_NETWORK_ID,
  GOERLI_NETWORK_ID,
  HOLESKY_NETWORK_ID,
} from '~root/providers/networkInfo.provider';
import { getLocalStorageFlagValue, MAXIMUM_VALIDATOR_COUNT_FLAG } from '~lib/utils/developerHelper';

type NavigationRoutes = Record<string, string | Record<number, string>>;

export enum EBulkMode {
  SINGLE,
  MULTI,
}

export enum EValidatorFlowAction {
  ADD_CLUSTER,
  GENERATE_NEW_SHARE,
  ALREADY_HAVE_SHARES,
  GENERATE_KEY_SHARES_ONLINE,
  GENERATE_KEY_SHARES_OFFLINE,
  OFFLINE_CLI,
  OFFLINE_DKG,
  FIRST_REGISTER,
  SECOND_REGISTER,
}

const MAX_VALIDATORS_PER_CLUSTER_SIZE: Record<number, number> = {
  [config.GLOBAL_VARIABLE.CLUSTER_SIZES.QUAD_CLUSTER]: config.GLOBAL_VARIABLE.FIXED_VALIDATORS_COUNT_PER_CLUSTER_SIZE.QUAD_CLUSTER,
  [config.GLOBAL_VARIABLE.CLUSTER_SIZES.SEPT_CLUSTER]: config.GLOBAL_VARIABLE.FIXED_VALIDATORS_COUNT_PER_CLUSTER_SIZE.SEPT_CLUSTER,
  [config.GLOBAL_VARIABLE.CLUSTER_SIZES.DECA_CLUSTER]: config.GLOBAL_VARIABLE.FIXED_VALIDATORS_COUNT_PER_CLUSTER_SIZE.DECA_CLUSTER,
  [config.GLOBAL_VARIABLE.CLUSTER_SIZES.TRISKAIDEKA_CLUSTER]: config.GLOBAL_VARIABLE.FIXED_VALIDATORS_COUNT_PER_CLUSTER_SIZE.TRISKAIDEKA_CLUSTER,
};

const NETWORK_TO_BULK_MODE = {
  [`${MAINNET_NETWORK_ID}`]: EBulkMode.SINGLE,
  [`${HOLESKY_NETWORK_ID}`]: EBulkMode.MULTI,
  [`${GOERLI_NETWORK_ID}`]: EBulkMode.MULTI,
};

const BULK_MODE_TO_ROUTES: NavigationRoutes = {
  [config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT]: config.routes.SSV.MY_ACCOUNT.CLUSTER.DISTRIBUTION_METHOD_START,
  [config.routes.SSV.MY_ACCOUNT.CLUSTER.DISTRIBUTION_METHOD_START]: {
    [EValidatorFlowAction.SECOND_REGISTER]: config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES,
    [EValidatorFlowAction.GENERATE_KEY_SHARES_ONLINE]: config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEY_STORE,
    [EValidatorFlowAction.GENERATE_KEY_SHARES_OFFLINE]: config.routes.SSV.MY_ACCOUNT.CLUSTER.DISTRIBUTE_OFFLINE,
  },
  [config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD]: config.routes.SSV.VALIDATOR.HOME,
  [config.routes.SSV.VALIDATOR.HOME]: {
    [EValidatorFlowAction.GENERATE_NEW_SHARE]: config.routes.SSV.VALIDATOR.SELECT_OPERATORS,
    [EValidatorFlowAction.ALREADY_HAVE_SHARES]: config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES,
  },
  [config.routes.SSV.VALIDATOR.SELECT_OPERATORS]: config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.START,
  [config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES]: {
    [EValidatorFlowAction.FIRST_REGISTER]: config.routes.SSV.VALIDATOR.FUNDING_PERIOD_PAGE,
    [EValidatorFlowAction.SECOND_REGISTER]: config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR,
  },
  [config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEY_STORE]: {
    [EValidatorFlowAction.FIRST_REGISTER]: config.routes.SSV.VALIDATOR.FUNDING_PERIOD_PAGE,
    [EValidatorFlowAction.SECOND_REGISTER]: config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR,
  },
  [config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.START]: {
    [EValidatorFlowAction.GENERATE_KEY_SHARES_ONLINE]: config.routes.SSV.VALIDATOR.IMPORT,
    [EValidatorFlowAction.GENERATE_KEY_SHARES_OFFLINE]: config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_OFFLINE,
  },
  [config.routes.SSV.VALIDATOR.IMPORT]: {
    [EValidatorFlowAction.FIRST_REGISTER]: config.routes.SSV.VALIDATOR.FUNDING_PERIOD_PAGE,
    [EValidatorFlowAction.SECOND_REGISTER]: config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR,
  },
  [config.routes.SSV.VALIDATOR.FUNDING_PERIOD_PAGE]: config.routes.SSV.VALIDATOR.ACCOUNT_BALANCE_AND_FEE,
  [config.routes.SSV.VALIDATOR.ACCOUNT_BALANCE_AND_FEE]: config.routes.SSV.VALIDATOR.SLASHING_WARNING,
  [config.routes.SSV.VALIDATOR.SLASHING_WARNING]: config.routes.SSV.VALIDATOR.CONFIRMATION_PAGE,
  [config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_OFFLINE]: {
    [EValidatorFlowAction.OFFLINE_CLI]: config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES,
    [EValidatorFlowAction.OFFLINE_DKG]: config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_SUMMARY,
  },
  [config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES]: {
    [EValidatorFlowAction.FIRST_REGISTER]: config.routes.SSV.VALIDATOR.FUNDING_PERIOD_PAGE,
    [EValidatorFlowAction.SECOND_REGISTER]: config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR,
  },
  [config.routes.SSV.MY_ACCOUNT.CLUSTER.ADD_VALIDATOR]: config.routes.SSV.VALIDATOR.ACCOUNT_BALANCE_AND_FEE,
  [config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_SUMMARY]: config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES,
};

const validatorRegistrationFlow = (currentRoute: string) => {
  const getMaxValidatorsCountPerRegistration = (clusterSize: number, walletLabel: string = '') => {
    let maximumCount;
    if (isBulkMode(EBulkMode.SINGLE)) {
      maximumCount = config.GLOBAL_VARIABLE.MIN_VALIDATORS_COUNT_PER_BULK_REGISTRATION;
    } else {
      maximumCount = MAX_VALIDATORS_PER_CLUSTER_SIZE[clusterSize];
    }
    return Number(getLocalStorageFlagValue(MAXIMUM_VALIDATOR_COUNT_FLAG)) || maximumCount;
  };

  const getNextNavigation = (action?: EValidatorFlowAction): string => {
    const nextAvailableRoutes = BULK_MODE_TO_ROUTES[currentRoute];
    let nextRoute = nextAvailableRoutes;
    if (action !== undefined) {
      nextRoute = nextAvailableRoutes[action];
    }
    if (typeof nextRoute === 'string') {
      return nextRoute;
    } else {
      throw Error('Route undefined');
    }
  };

  /**
   * Returns the expected Bulk Mode behavior per currently defined network/chain.
   */
  const getBulkMode = (): EBulkMode => {
    const currentNetwork: number = getStoredNetwork().networkId;
    return NETWORK_TO_BULK_MODE[currentNetwork];
  };

  const isBulkMode = (mode: EBulkMode) => getBulkMode() === mode;

  const getBulkKeyShareComponent = (single: JSX.Element, multi: JSX.Element): JSX.Element => {
    return isBulkMode(EBulkMode.MULTI) ? multi : single;
  };

  return { getNextNavigation, getBulkKeyShareComponent, getBulkMode, isBulkMode, getMaxValidatorsCountPerRegistration };
};

export default validatorRegistrationFlow;
