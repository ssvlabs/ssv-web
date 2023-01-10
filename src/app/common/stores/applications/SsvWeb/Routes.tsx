import React, { Suspense } from 'react';
import { observer } from 'mobx-react';
import { Route, Routes as Wrapper } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/components/common/Layout';
import { SsvAppBar } from '~app/components/common/AppBar';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import MyAccount from '~app/components/applications/SSV/MyAccount';
import Welcome from '~app/components/applications/SSV/Welcome/Welcome';
import SuccessScreen from '~app/components/applications/SSV/SuccessScreen';
import SetOperatorFee from '~app/components/applications/SSV/SetOperatorFee';
import Deposit from '~app/components/applications/SSV/MyAccount/components/Deposit';
import Withdraw from '~app/components/applications/SSV/MyAccount/components/Withdraw';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported';
import OperatorSuccessPage from '~app/components/applications/SSV/OperatorSuccessPage';
import GenerateOperatorKeys from '~app/components/applications/SSV/GenerateOperatorKeys';
import RegisterOperatorHome from '~app/components/applications/SSV/RegisterOperatorHome';
import RegisterValidatorHome from '~app/components/applications/SSV/RegisterValidatorHome';
import EnableAccount from '~app/components/applications/SSV/MyAccount/components/EnableAccount';
import OperatorTransactionConfirmation from '~app/components/applications/SSV/OperatorConfirmation';
import SingleOperator from '~app/components/applications/SSV/MyAccount/components/Operator/SingleOperator';
import ValidatorTransactionConfirmation from '~app/components/applications/SSV/ImportValidatorConfirmation';
import FundingPeriod from '~app/components/applications/SSV/RegisterValidatorHome/components/FundingPeriod';
import UpdateFee from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee';
import SingleValidator from '~app/components/applications/SSV/MyAccount/components/Validator/SingleValidator';
import ImportValidator from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportValidator';
import CreateValidator from '~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator';
import SlashingWarning from '~app/components/applications/SSV/RegisterValidatorHome/components/SlashingWarning';
import SelectOperators from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators';
import EditValidator from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/EditValidator';
import UploadKeyStore from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/UploadKeyStore';
// import FundingNewValidator from '~app/components/applications/SSV/MyAccount/components/Validator/FundingNewValidator';
import RemoveOperator from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/RemoveOperator';
import DepositViaLaunchpad from '~app/components/applications/SSV/RegisterValidatorHome/components/DepositViaLaunchpad';
import OperatorRemoved from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/OperatorRemoved';
import RemoveValidator
  from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/RemoveValidator';
import AccountBalanceAndFee
  from '~app/components/applications/SSV/RegisterValidatorHome/components/AccountBalanceAndFee';
import ProductQuestions
  from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/ProductQuestions';
import ConfirmOperatorsChange
  from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/ConfirmOperatorsChange';

const Routes: any = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const ssvRoutes = config.routes.SSV;
  if (!walletStore.accountDataLoaded) return <div>Loading...</div>;

  const dashboardRoutes: any = [
    { path: ssvRoutes.MY_ACCOUNT.DEPOSIT, Component: Deposit },
    { path: ssvRoutes.MY_ACCOUNT.WITHDRAW, Component: Withdraw },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.ROOT, Component: SingleOperator },
    { path: ssvRoutes.MY_ACCOUNT.ENABLE_ACCOUNT, Component: EnableAccount },
    { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.ROOT, Component: SingleValidator },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.REMOVE.ROOT, Component: RemoveOperator },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.REMOVE.SUCCESS, Component: OperatorRemoved },
    // { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.ADD_VALIDATOR, Component: FundingNewValidator },
    { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_REMOVE.ROOT, Component: RemoveValidator },
    { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_REMOVE.REMOVED, Component: ProductQuestions },
    { path: ssvRoutes.MY_ACCOUNT.OPERATOR.UPDATE_FEE.ROOT, Component: UpdateFee, index: true },
    { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.ENTER_KEYSTORE, Component: UploadKeyStore },
    { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CHOOSE_OPERATORS, Component: EditValidator },
    { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.SUCCESS, Component: ConfirmOperatorsChange },
    { path: ssvRoutes.MY_ACCOUNT.VALIDATOR.VALIDATOR_UPDATE.CONFIRM_TRANSACTION, Component: ConfirmOperatorsChange },
  ];

  const operatorRoutes = [
    { path: ssvRoutes.OPERATOR.SET_FEE_PAGE, Component: SetOperatorFee },
    { path: ssvRoutes.OPERATOR.SUCCESS_PAGE, Component: OperatorSuccessPage },
    { path: ssvRoutes.OPERATOR.GENERATE_KEYS, Component: GenerateOperatorKeys },
    { path: ssvRoutes.OPERATOR.CONFIRMATION_PAGE, Component: OperatorTransactionConfirmation },
  ];

  const validatorsRoutes = [
    { path: ssvRoutes.VALIDATOR.CREATE, Component: CreateValidator },
    { path: ssvRoutes.VALIDATOR.IMPORT, Component: ImportValidator },
    { path: ssvRoutes.VALIDATOR.SUCCESS_PAGE, Component: SuccessScreen },
    { path: ssvRoutes.VALIDATOR.SELECT_OPERATORS, Component: SelectOperators },
    { path: ssvRoutes.VALIDATOR.SLASHING_WARNING, Component: SlashingWarning },
    { path: ssvRoutes.VALIDATOR.FUNDING_PERIOD_PAGE, Component: FundingPeriod },
    { path: ssvRoutes.VALIDATOR.DEPOSIT_VALIDATOR, Component: DepositViaLaunchpad },
    { path: ssvRoutes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE, Component: AccountBalanceAndFee },
    { path: ssvRoutes.VALIDATOR.CONFIRMATION_PAGE, Component: ValidatorTransactionConfirmation },
  ];

  return (
    <Layout>
      <SsvAppBar />
      <Wrapper>
        <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported />} />
        <Route path={ssvRoutes.ROOT} element={<Welcome />} /> 
        <Route path={ssvRoutes.MY_ACCOUNT.DASHBOARD}>
          <Route index element={<MyAccount />} />
          {dashboardRoutes.map((route: any, index: number) => { 
            return (
              <Suspense key={index} fallback={<></>}> 
                <Route path={route.path} element={<route.Component />} /> 
              </Suspense> 
            ); 
           })} 
        </Route>
        <Route path={ssvRoutes.OPERATOR.HOME}>
          <Route index element={<RegisterOperatorHome />} />
          {operatorRoutes.map((route, index: number) => {
            return (
              <Suspense key={index} fallback={<></>}>
                <Route path={route.path} element={<route.Component />} />
              </Suspense>
            );
          })}
        </Route>

        <Route path={ssvRoutes.VALIDATOR.HOME}>
          <Route index element={<RegisterValidatorHome />} />
          {validatorsRoutes.map((route, index: number) => {
            return (
              <Suspense key={index} fallback={<></>}>
                <Route path={route.path} element={<route.Component />} />
              </Suspense>
            );
          })}
        </Route>
      </Wrapper>
    </Layout>
  );
};

export default observer(Routes);
