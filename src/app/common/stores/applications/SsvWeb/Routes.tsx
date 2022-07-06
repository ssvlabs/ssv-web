import React, { Suspense } from 'react';
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
import SuccessScreen from '~app/components/applications/SSV/SuccessScreen';
import SetOperatorFee from '~app/components/applications/SSV/SetOperatorFee';
import Deposit from '~app/components/applications/SSV/MyAccount/components/Deposit';
import Withdraw from '~app/components/applications/SSV/MyAccount/components/Withdraw';
import OperatorSuccessPage from '~app/components/applications/SSV/OperatorSuccessPage';
import GenerateOperatorKeys from '~app/components/applications/SSV/GenerateOperatorKeys';
import RegisterOperatorHome from '~app/components/applications/SSV/RegisterOperatorHome';
import RegisterValidatorHome from '~app/components/applications/SSV/RegisterValidatorHome';
import EnableAccount from '~app/components/applications/SSV/MyAccount/components/EnableAccount';
import OperatorTransactionConfirmation from '~app/components/applications/SSV/OperatorConfirmation';
import SingleOperator from '~app/components/applications/SSV/MyAccount/components/Operator/SingleOperator';
import ValidatorTransactionConfirmation from '~app/components/applications/SSV/ImportValidatorConfirmation';
import UpdateFee from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee';
import SingleValidator from '~app/components/applications/SSV/MyAccount/components/Validator/SingleValidator';
import ImportValidator from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportValidator';
import CreateValidator from '~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator';
import SlashingWarning from '~app/components/applications/SSV/RegisterValidatorHome/components/SlashingWarning';
import SelectOperators from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators';
import EditValidator from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/EditValidator';
import UploadKeyStore from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/UploadKeyStore';
import RemoveOperator from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/RemoveOperator';
import DepositViaLaunchpad from '~app/components/applications/SSV/RegisterValidatorHome/components/DepositViaLaunchpad';
import OperatorRemoved from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/OperatorRemoved';
import RemoveValidator from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/RemoveValidator';
import AccountBalanceAndFee from '~app/components/applications/SSV/RegisterValidatorHome/components/AccountBalanceAndFee';
import ProductQuestions from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/ProductQuestions';
import ConfirmOperatorsChange from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/ConfirmOperatorsChange';

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
        { path: ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.START, component: UpdateFee },
        { path: ssvRoutes.MY_ACCOUNT.OPERATOR.REMOVE.ROOT, component: RemoveOperator },
        { path: ssvRoutes.MY_ACCOUNT.OPERATOR.REMOVE.SUCCESS, component: OperatorRemoved },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_REMOVE.ROOT, component: RemoveValidator },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_REMOVE.REMOVED, component: ProductQuestions },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.ENTER_KEYSTORE, component: UploadKeyStore },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CHOOSE_OPERATORS, component: EditValidator },
        { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CONFIRM_TRANSACTION, component: ConfirmOperatorsChange },
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