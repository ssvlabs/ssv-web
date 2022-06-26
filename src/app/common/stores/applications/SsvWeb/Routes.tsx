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
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported';
const SuccessScreen = lazy(() => import('~app/components/applications/SSV/SuccessScreen'));
const SetOperatorFee = lazy(() => import('~app/components/applications/SSV/SetOperatorFee'));
const Deposit = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Deposit'));
const Withdraw = lazy(() => import('~app/components/applications/SSV/MyAccount/components/Withdraw'));
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
    const ssvRoutes = config.routes.SSV;
    if (!walletStore.accountDataLoaded) return <div>Loading...</div>;

    const dashboardRoutes = [
        { path: ssvRoutes.MY_ACCOUNT.DEPOSIT, component: Deposit },
        { path: ssvRoutes.MY_ACCOUNT.WITHDRAW, component: Withdraw },
        { path: ssvRoutes.MY_ACCOUNT.DASHBOARD, component: MyAccount },
        { path: ssvRoutes.MY_ACCOUNT.OPERATOR.ROOT, component: SingleOperator },
        { path: ssvRoutes.MY_ACCOUNT.ENABLE_ACCOUNT, component: EnableAccount },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.ROOT, component: SingleValidator },
        { path: ssvRoutes.MY_ACCOUNT.UPLOAD_KEY_STORE, component: UploadKeyStore },
        { path: ssvRoutes.MY_ACCOUNT.REMOVE_VALIDATOR, component: RemoveValidator },
        { path: ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE.SELECT_OPERATORS, component: UpdateFee },
        { path: ssvRoutes.MY_ACCOUNT.CONFIRM_OPERATORS, component: ConfirmOperatorsChange },
        { path: ssvRoutes.MY_ACCOUNT.OPERATOR.REMOVE.ROOT, component: RemoveOperator },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_REMOVE.ROOT, component: ProductQuestions },
        { path: ssvRoutes.MY_ACCOUNT.OPERATOR.REMOVE.SUCCESS, component: OperatorRemoved },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CHOOSE_OPERATORS, component: EditValidator },
    ];

    const operatorRoutes = [
        { path: ssvRoutes.OPERATOR.HOME, component: RegisterOperatorHome },
        { path: ssvRoutes.OPERATOR.SET_FEE_PAGE, component: SetOperatorFee },
        { path: ssvRoutes.OPERATOR.SUCCESS_PAGE, component: OperatorSuccessPage },
        { path: ssvRoutes.OPERATOR.GENERATE_KEYS, component: GenerateOperatorKeys },
        { path: ssvRoutes.OPERATOR.CONFIRMATION_PAGE, component: OperatorTransactionConfirmation },
    ];

    const validatorsRoutes = [
        { path: ssvRoutes.VALIDATOR.CREATE, component: CreateValidator },
        { path: ssvRoutes.VALIDATOR.IMPORT, component: ImportValidator },
        { path: ssvRoutes.VALIDATOR.HOME, component: RegisterValidatorHome },
        { path: ssvRoutes.VALIDATOR.SUCCESS_PAGE, component: SuccessScreen },
        { path: ssvRoutes.VALIDATOR.SELECT_OPERATORS, component: SelectOperators },
        { path: ssvRoutes.VALIDATOR.SLASHING_WARNING, component: SlashingWarning },
        { path: ssvRoutes.VALIDATOR.DEPOSIT_VALIDATOR, component: DepositViaLaunchpad },
        { path: ssvRoutes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE, component: AccountBalanceAndFee },
        { path: ssvRoutes.VALIDATOR.CONFIRMATION_PAGE, component: ValidatorTransactionConfirmation },
    ];

    return (
      <Layout>
        <SsvAppBar />
        <Route exact path={config.routes.COUNTRY_NOT_SUPPORTED} component={CountryNotSupported} />
        <Route exact path={ssvRoutes.ROOT} component={Welcome} />
        <Route path={ssvRoutes.MY_ACCOUNT.DASHBOARD}>
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
        <Route path={ssvRoutes.OPERATOR.HOME}>
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

        <Route path={ssvRoutes.VALIDATOR.HOME}>
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