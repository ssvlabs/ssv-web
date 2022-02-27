import _ from 'underscore';
import { useHistory, useRouteMatch } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';

export type IUserFlow = {
  name: string,
  route: string | string[],
  depends?: IUserFlow[],
  condition?: () => boolean,
};

const { routes } = config;

const welcomeFlow: IUserFlow = {
  name: 'Welcome',
  route: routes.HOME,
};

const operatorsHomeFlow: IUserFlow = {
  name: 'Operators Home',
  route: routes.OPERATOR.HOME,
};

const operatorConfirmation: IUserFlow = {
  name: 'Operator Confirmation',
  route: routes.OPERATOR.CONFIRMATION_PAGE,
  depends: [
    operatorsHomeFlow,
  ],
  condition: () => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    return !!operatorStore.newOperatorKeys.pubKey && !!operatorStore.newOperatorKeys.name;
  },
};

const validatorsHomeFlow: IUserFlow = {
  name: 'Validators Home',
  route: routes.VALIDATOR.HOME,
};

const importValidatorFlow: IUserFlow = {
  name: 'Import Validator',
  route: routes.VALIDATOR.IMPORT,
  depends: [
    validatorsHomeFlow,
  ],
  condition: () => {
    const stores = useStores();
    const validatorStore: ValidatorStore = stores.Validator;
    return !!validatorStore.validatorPrivateKeyFile;
  },
};

const selectOperatorsValidatorFlow: IUserFlow = {
  name: 'Select Operators For Validators',
  route: routes.VALIDATOR.SELECT_OPERATORS,
  depends: [
    importValidatorFlow,
  ],
  condition: () => {
    const stores = useStores();
    const validatorStore: ValidatorStore = stores.Validator;
    return !!validatorStore.validatorPrivateKeyFile;
  },
};

const importValidatorDecryptFlow: IUserFlow = {
  name: 'Decrypt Keystore File',
  route: routes.VALIDATOR.DECRYPT,
  depends: [
    importValidatorFlow,
  ],
  condition: () => {
    const stores = useStores();
    const validatorStore: ValidatorStore = stores.Validator;
    return !!validatorStore.validatorPrivateKey;
  },
};

const createValidatorFlow: IUserFlow = {
  name: 'Create Validator',
  route: routes.VALIDATOR.CREATE,
  depends: [
    validatorsHomeFlow,
  ],
};

const validatorSelectOperatorsFlow: IUserFlow = {
  name: 'Select Operators',
  route: routes.VALIDATOR.SELECT_OPERATORS,
  condition: () => {
    const stores = useStores();
    const validatorStore: ValidatorStore = stores.Validator;
    return !!(validatorStore.validatorPrivateKey && validatorStore.validatorPrivateKeyFile);
  },
  depends: [
    validatorsHomeFlow,
  ],
};

const slashingWarningFlow: IUserFlow = {
  name: 'Slashing Warning',
  route: routes.VALIDATOR.SLASHING_WARNING,
  depends: [
    validatorSelectOperatorsFlow,
  ],
  condition: () => {
    const stores = useStores();
    const operatorStore: OperatorStore = stores.Operator;
    return !!operatorStore.operators?.length;
  },
};

const validatorConfirmationFlow: IUserFlow = {
  name: 'Validator Confirmation',
  route: routes.VALIDATOR.CONFIRMATION_PAGE,
  depends: [
    slashingWarningFlow,
  ],
  condition: () => {
    const stores = useStores();
    const validatorStore: ValidatorStore = stores.Validator;
    if (!validatorStore.validatorPrivateKey) {
      return false;
    }
    return slashingWarningFlow.condition ? slashingWarningFlow.condition() : true;
  },
};

const successScreen: IUserFlow = {
  name: 'Success Screen',
  route: [
    routes.VALIDATOR.SUCCESS_PAGE,
    routes.OPERATOR.SUCCESS_PAGE,
  ],
  condition: () => {
    const stores = useStores();
    const validatorStore: ValidatorStore = stores.Validator;
    const operatorStore: OperatorStore = stores.Operator;
    return operatorStore.newOperatorRegisterSuccessfully || validatorStore.newValidatorReceipt;
  },
  depends: [
    welcomeFlow,
  ],
};

const myAccountScreen: IUserFlow = {
  name: 'My Account',
  route: routes.MY_ACCOUNT.DASHBOARD,
  depends: [
    welcomeFlow,
  ],
  // condition: () => {
  //   const stores = useStores();
  //   const ssvStore: SsvStore = stores.SSV;
  //   return !!ssvStore.userOperators.length || !!ssvStore.userValidators.length;
  // },
};

const DepositScreen: IUserFlow = {
  name: 'Deposit',
  route: routes.MY_ACCOUNT.DEPOSIT,
  depends: [
    welcomeFlow,
  ],
  // condition: () => {
  //   const stores = useStores();
  //   const ssvStore: SsvStore = stores.SSV;
  //   return !!ssvStore.userOperators.length || !!ssvStore.userValidators.length;
  // },
};

const WithdrawScreen: IUserFlow = {
  name: 'Withdraw',
  route: routes.MY_ACCOUNT.WITHDRAW,
  depends: [
    welcomeFlow,
  ],
  // condition: () => {
  //   const stores = useStores();
  //   const ssvStore: SsvStore = stores.SSV;
  //   return !!ssvStore.userOperators.length || !!ssvStore.userValidators.length;
  // },
};

const EnableAccountScreen: IUserFlow = {
  name: 'Enable Account',
  route: routes.MY_ACCOUNT.ENABLE_ACCOUNT,
  depends: [
    welcomeFlow,
  ],
  condition: () => {
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    return !ssvStore.userLiquidated && !!ssvStore.userValidators.length;
  },
};

const userFlows: IUserFlow[] = [
  welcomeFlow,
  successScreen,
  DepositScreen,
  WithdrawScreen,
  myAccountScreen,
  operatorsHomeFlow,
  validatorsHomeFlow,
  EnableAccountScreen,
  importValidatorFlow,
  slashingWarningFlow,
  createValidatorFlow,
  operatorConfirmation,
  validatorConfirmationFlow,
  importValidatorDecryptFlow,
  validatorSelectOperatorsFlow,
  selectOperatorsValidatorFlow,
];

const dispatchUserFlow = (
  flows: IUserFlow[],
  currentPath: string,
  isDependency: boolean = false,
): IUserFlow | null => {
  for (let i = 0; i < flows.length; i += 1) {
    const flow = flows[i];
    const routeMatched = _.isArray(flow.route)
      ? flow.route.indexOf(currentPath) !== -1
      : currentPath === flow.route;

    if (isDependency || routeMatched) {
      if (typeof flow.condition === 'function') {
        const condition = flow.condition();
        if (!condition) {
          if (flow.depends?.length) {
            const requiredFlow = dispatchUserFlow(flow.depends, currentPath, true);
            return requiredFlow ?? flow;
          }
          return flow;
        }
      } else if (flow.depends?.length) {
        return dispatchUserFlow(flow.depends, currentPath, true);
      } else {
        return flow;
      }
    }
  }
  return null;
};

const setUserFlow = (userFlow: string) => {
  localStorage.setItem('userFlow', userFlow);
};

const getUserFlow = () => {
  return localStorage.getItem('userFlow');
};

const useUserFlow = () => {
  const history = useHistory();
  const currentRoute = useRouteMatch();
  const requiredFlow = dispatchUserFlow(userFlows, currentRoute.path);
  let redirectUrl;
  if (requiredFlow) {
    redirectUrl = _.isArray(requiredFlow.route)
      ? requiredFlow.route[0]
      : requiredFlow.route;
  }

  return {
    setUserFlow,
    getUserFlow,
    routes,
    history,
    path: currentRoute.path,
    flows: userFlows,
    requiredFlow,
    redirectUrl,
  };
};

export default useUserFlow;
