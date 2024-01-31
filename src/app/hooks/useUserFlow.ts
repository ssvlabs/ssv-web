import _ from 'underscore';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
// import WalletStore from '~app/common/stores/Abstracts/Wallet';
// import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';

const { routes } = config;

export type IUserFlow = {
    name: string,
    depends?: IUserFlow[],
    whiteAppBar?: boolean,
    route: string | string[],
    condition?: () => boolean,
};

const operatorConfirmation: IUserFlow = {
    name: 'Operator Confirmation',
    route: routes.SSV.OPERATOR.CONFIRMATION_PAGE,
    condition: () => {
        const stores = useStores();
        const operatorStore: OperatorStore = stores.Operator;
        return !!operatorStore.newOperatorKeys.publicKey;
    },
};

const importValidatorFlow: IUserFlow = {
    name: 'Import Validator',
    route: routes.SSV.VALIDATOR.IMPORT,
    condition: () => {
        const stores = useStores();
        const validatorStore: ValidatorStore = stores.Validator;
        return !!validatorStore.keyStoreFile;
    },
};

const slashingWarningFlow: IUserFlow = {
    name: 'Slashing Warning',
    route: routes.SSV.VALIDATOR.SLASHING_WARNING,
    condition: () => {
        const stores = useStores();
        const operatorStore: OperatorStore = stores.Operator;
        return !!operatorStore.selectedEnoughOperators;
    },
};

const validatorConfirmationFlow: IUserFlow = {
    name: 'Validator Confirmation',
    route: routes.SSV.VALIDATOR.CONFIRMATION_PAGE,
    depends: [
        slashingWarningFlow,
    ],
    condition: () => {
        const stores = useStores();
        const validatorStore: ValidatorStore = stores.Validator;
        validatorStore;
        // if (!validatorStore.validatorPrivateKey) {
        //   return false;
        // }
        return slashingWarningFlow.condition ? slashingWarningFlow.condition() : true;
    },
};

const successScreens: IUserFlow = {
    name: 'Success Screen',
    route: [
        routes.SSV.VALIDATOR.SUCCESS_PAGE,
        routes.SSV.OPERATOR.SUCCESS_PAGE,
    ],
    condition: () => {
        const stores = useStores();
        const validatorStore: ValidatorStore = stores.Validator;
        const operatorStore: OperatorStore = stores.Operator;
        return operatorStore.newOperatorRegisterSuccessfully || validatorStore.newValidatorReceipt;
    },
};

const myAccountScreen: IUserFlow = {
    name: 'My Account',
    route: routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD,
};

const ReactivateClusterScreen: IUserFlow = {
    name: 'Enable Account',
    route: routes.SSV.MY_ACCOUNT.CLUSTER.REACTIVATE,
    depends: [
        myAccountScreen,
    ],
};

const SingleValidatorScreen: IUserFlow = {
    name: 'Single Validator',
    route: routes.SSV.MY_ACCOUNT.CLUSTER.ROOT,
    depends: [
        myAccountScreen,
    ],
    whiteAppBar: true,
};

const userFlows: IUserFlow[] = [
    successScreens,
    myAccountScreen,
    importValidatorFlow,
    slashingWarningFlow,
    operatorConfirmation,
    SingleValidatorScreen,
    ReactivateClusterScreen,
    validatorConfirmationFlow,
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
    window.localStorage.setItem('userFlow', userFlow);
};

const getUserFlow = () => {
    return window.localStorage.getItem('userFlow');
};

const useUserFlow = () => {
    const navigate = useNavigate();
    // @ts-ignore
    const requiredFlow = dispatchUserFlow(userFlows, useLocation().pathname);

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
        navigate,
        path: useLocation().pathname,
        flows: userFlows,
        requiredFlow,
        redirectUrl,
    };
};

export default useUserFlow;
