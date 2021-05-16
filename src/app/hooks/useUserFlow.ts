import _ from 'underscore';
import { useHistory, useRouteMatch } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import ContractValidator from '~app/common/stores/contract/ContractValidator.store';
import ContractOperator from '~app/common/stores/contract/ContractOperator.store';

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
  condition: () => {
    const stores = useStores();
    const contractOperator: ContractOperator = stores.ContractOperator;
    return !!contractOperator.newOperatorKeys.pubKey && !!contractOperator.newOperatorKeys.name;
  },
  depends: [
    operatorsHomeFlow,
  ],
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
    const contractValidator: ContractValidator = stores.ContractValidator;
    return !!contractValidator.validatorPrivateKeyFile;
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
    const contractValidator: ContractValidator = stores.ContractValidator;
    return !!contractValidator.validatorPrivateKey;
  },
};

const createValidatorFlow: IUserFlow = {
  name: 'Create Validator',
  route: routes.VALIDATOR.CREATE,
  depends: [
    validatorsHomeFlow,
  ],
};

const slashingWarningFlow: IUserFlow = {
  name: 'Slashing Warning',
  route: routes.VALIDATOR.SLASHING_WARNING,
  depends: [
    importValidatorFlow,
    createValidatorFlow,
  ],
  condition: () => {
    const stores = useStores();
    const contractValidator: ContractValidator = stores.ContractValidator;
    return !!contractValidator.validatorPrivateKey;
  },
};

const validatorConfirmationFlow: IUserFlow = {
  name: 'Validator Confirmation',
  route: routes.VALIDATOR.CONFIRMATION_PAGE,
  depends: [
    slashingWarningFlow,
  ],
  condition: slashingWarningFlow.condition,
};

const successScreen: IUserFlow = {
  name: 'Success Screen',
  route: [
    routes.VALIDATOR.SUCCESS_PAGE,
    routes.OPERATOR.SUCCESS_PAGE,
  ],
  condition: () => {
    const stores = useStores();
    const contractValidator: ContractValidator = stores.ContractValidator;
    const contractOperator: ContractOperator = stores.ContractOperator;
    return contractOperator.newOperatorRegisterSuccessfully || contractValidator.newValidatorReceipt;
  },
  depends: [
    welcomeFlow,
  ],
};

const userFlows: IUserFlow[] = [
  welcomeFlow,
  operatorsHomeFlow,
  operatorConfirmation,
  validatorsHomeFlow,
  importValidatorFlow,
  createValidatorFlow,
  importValidatorDecryptFlow,
  slashingWarningFlow,
  validatorConfirmationFlow,
  successScreen,
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
    routes,
    history,
    path: currentRoute.path,
    flows: userFlows,
    requiredFlow,
    redirectUrl,
  };
};

export default useUserFlow;
