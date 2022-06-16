import React, { Suspense, lazy } from 'react';
import { observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/components/common/Layout';
import { SsvAppBar } from '~app/components/common/AppBar';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import MyAccount from '~app/components/applications/SSV/MyAccount';
import Welcome from '~app/components/applications/SSV/Welcome/Welcome';
const SuccessScreen = lazy(() => import('~app/components/applications/SSV/SuccessScreen'));
const SetOperatorFee = lazy(() => import('~app/components/applications/SSV/SetOperatorFee'));
const Deposit = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Deposit'));
const Withdraw = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Withdraw'));
const CountryNotSupported = lazy(() => import('~app/components/applications/SSV/CountryNotSupported'));
const OperatorSuccessPage = lazy(() => import('~app/components/applications/SSV/OperatorSuccessPage'));
const GenerateOperatorKeys = lazy(() => import('~app/components/applications/SSV/GenerateOperatorKeys'));
const RegisterOperatorHome = lazy(() => import('~app/components/applications/SSV/RegisterOperatorHome'));
const RegisterValidatorHome = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome'));
const EnableAccount = lazy(() => import('~app/components/applications/SSV/MyAccount/components/EnableAccount'));
const OperatorTransactionConfirmation = lazy(() => import('~app/components/applications/SSV/OperatorConfirmation'));
const SingleOperator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Operator/SingleOperator'));
const ValidatorTransactionConfirmation = lazy(() => import('~app/components/applications/SSV/ImportValidatorConfirmation'));
const UpdateFee = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee'));
const SingleValidator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/SingleValidator'));
const ImportValidator = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/ImportValidator'));
const CreateValidator = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator'));
const SlashingWarning = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/SlashingWarning'));
const SelectOperators = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators'));
const EditValidator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/EditValidator'));
const UploadKeyStore = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/UploadKeyStore'));
const RemoveOperator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/RemoveOperator'));
const DepositViaLaunchpad = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/DepositViaLaunchpad'));
const OperatorRemoved = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/OperatorRemoved'));
const RemoveValidator = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/RemoveValidator'));
const AccountBalanceAndFee = lazy(() => import('~app/components/applications/SSV/RegisterValidatorHome/components/AccountBalanceAndFee'));
const ProductQuestions = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/ProductQuestions'));
const ConfirmOperatorsChange = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/ConfirmOperatorsChange'));

const Routes: any = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    if (!walletStore.accountDataLoaded) return <div>Loading...</div>;

    const dashboardRoutes = [
        { path: config.routes.MY_ACCOUNT.DEPOSIT, component: Deposit },
        { path: config.routes.MY_ACCOUNT.WITHDRAW, component: Withdraw },
        { path: config.routes.MY_ACCOUNT.DASHBOARD, component: MyAccount },
        { path: config.routes.MY_ACCOUNT.OPERATOR, component: SingleOperator },
        { path: config.routes.MY_ACCOUNT.VALIDATOR, component: SingleValidator },
        { path: config.routes.MY_ACCOUNT.ENABLE_ACCOUNT, component: EnableAccount },
        { path: config.routes.MY_ACCOUNT.EDIT_VALIDATOR, component: EditValidator },
        { path: config.routes.MY_ACCOUNT.OPERATOR_UPDATE_FEE, component: UpdateFee },
        { path: config.routes.MY_ACCOUNT.REMOVE_OPERATOR, component: RemoveOperator },
        { path: config.routes.MY_ACCOUNT.OPERATOR_REMOVED, component: OperatorRemoved },
        { path: config.routes.MY_ACCOUNT.UPLOAD_KEY_STORE, component: UploadKeyStore },
        { path: config.routes.MY_ACCOUNT.REMOVE_VALIDATOR, component: RemoveValidator },
        { path: config.routes.MY_ACCOUNT.VALIDATOR_REMOVED, component: ProductQuestions },
        { path: config.routes.MY_ACCOUNT.CONFIRM_OPERATORS, component: ConfirmOperatorsChange },
    ];

    const operatorRoutes = [
        { path: config.routes.OPERATOR.HOME, component: RegisterOperatorHome },
        { path: config.routes.OPERATOR.SET_FEE_PAGE, component: SetOperatorFee },
        { path: config.routes.OPERATOR.SUCCESS_PAGE, component: OperatorSuccessPage },
        { path: config.routes.OPERATOR.GENERATE_KEYS, component: GenerateOperatorKeys },
        { path: config.routes.OPERATOR.CONFIRMATION_PAGE, component: OperatorTransactionConfirmation },
    ];

    const validatorsRoutes = [
        { path: config.routes.VALIDATOR.CREATE, component: CreateValidator },
        { path: config.routes.VALIDATOR.IMPORT, component: ImportValidator },
        { path: config.routes.VALIDATOR.HOME, component: RegisterValidatorHome },
        { path: config.routes.VALIDATOR.SUCCESS_PAGE, component: SuccessScreen },
        { path: config.routes.VALIDATOR.SELECT_OPERATORS, component: SelectOperators },
        { path: config.routes.VALIDATOR.SLASHING_WARNING, component: SlashingWarning },
        { path: config.routes.VALIDATOR.DEPOSIT_VALIDATOR, component: DepositViaLaunchpad },
        { path: config.routes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE, component: AccountBalanceAndFee },
        { path: config.routes.VALIDATOR.CONFIRMATION_PAGE, component: ValidatorTransactionConfirmation },
    ];

    return (
      <Layout>
        <SsvAppBar />
        <Route exact path={config.routes.COUNTRY_NOT_SUPPORTED} component={CountryNotSupported} />
        <Route exact path={config.routes.HOME} component={Welcome} />
        <Route path={config.routes.MY_ACCOUNT.DASHBOARD}>
          <Switch>
            {dashboardRoutes.map((route, index:number) => {
                  return (
                    <Route key={index} exact path={route.path}>
                      <Suspense fallback={<></>}>
                        <route.component />
                      </Suspense>
                    </Route>
                  );
              })}
          </Switch>
        </Route>
        <Route path={config.routes.OPERATOR.HOME}>
          <Switch>
            {operatorRoutes.map((route, index:number) => {
                  return (
                    <Route key={index} exact path={route.path}>
                      <Suspense fallback={<></>}>
                        <route.component />
                      </Suspense>
                    </Route>
                  );
              })}
          </Switch>
        </Route>

        <Route path={config.routes.VALIDATOR.HOME}>
          <Switch>
            {validatorsRoutes.map((route, index:number) => {
                  return (
                    <Route key={index} exact path={route.path}>
                      <Suspense fallback={<></>}>
                        <route.component />
                      </Suspense>
                    </Route>
                  );
              })}
          </Switch>
        </Route>
      </Layout>
    );
};

export default observer(Routes);