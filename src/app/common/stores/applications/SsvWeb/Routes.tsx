import React from 'react';
import { observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import MyAccount from '~app/components/applications/SSV/MyAccount';
import Layout from '~app/components/common/Layout';
import Welcome from '~app/components/applications/SSV/Welcome/Welcome';
import { SsvAppBar } from '~app/components/common/AppBar';
import SuccessScreen from '~app/components/applications/SSV/SuccessScreen';
import SetOperatorFee from '~app/components/applications/SSV/SetOperatorFee';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import Deposit from '~app/components/applications/SSV/MyAccount/components/Deposit';
import Withdraw from '~app/components/applications/SSV/MyAccount/components/Withdraw';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported';
import OperatorSuccessPage from '~app/components/applications/SSV/OperatorSuccessPage';
import UpdateFee from '~app/components/applications/SSV/MyAccount/components/Operator/EditFeeFlow/UpdateFee';
import GenerateOperatorKeys from '~app/components/applications/SSV/GenerateOperatorKeys';
import RegisterOperatorHome from '~app/components/applications/SSV/RegisterOperatorHome';
import RegisterValidatorHome from '~app/components/applications/SSV/RegisterValidatorHome';
import EditValidator from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/EditValidator';
import EnableAccount from '~app/components/applications/SSV/MyAccount/components/EnableAccount';
import SingleOperator from '~app/components/applications/SSV/MyAccount/components/Operator/SingleOperator';
import UploadKeyStore from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/UploadKeyStore';
import OperatorRemoved from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/OperatorRemoved';
import RemoveOperator from '~app/components/applications/SSV/MyAccount/components/Operator/RemoveFlow/RemoveOperator';
import SingleValidator from '~app/components/applications/SSV/MyAccount/components/Validator/SingleValidator';
import OperatorTransactionConfirmation from '~app/components/applications/SSV/OperatorConfirmation';
import RemoveValidator from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/RemoveValidator';
import ProductQuestions from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/ProductQuestions';
import ValidatorTransactionConfirmation from '~app/components/applications/SSV/ImportValidatorConfirmation';
import ImportValidator from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportValidator';
import CreateValidator from '~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator';
import SlashingWarning from '~app/components/applications/SSV/RegisterValidatorHome/components/SlashingWarning';
import SelectOperators from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators';
import ConfirmOperatorsChange from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/ConfirmOperatorsChange';
import DepositViaLaunchpad from '~app/components/applications/SSV/RegisterValidatorHome/components/DepositViaLaunchpad';
import AccountBalanceAndFee from '~app/components/applications/SSV/RegisterValidatorHome/components/AccountBalanceAndFee';

const Routes: any = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    if (!walletStore.accountDataLoaded) return <div>Loading...</div>;

    return (
      <Layout>
        <SsvAppBar />
        <Route exact path={config.routes.COUNTRY_NOT_SUPPORTED} component={CountryNotSupported} />
        <Route exact path={config.routes.HOME} component={Welcome} />
        <Route path={config.routes.MY_ACCOUNT.DASHBOARD}>
          <Switch>
            <Route exact path={config.routes.MY_ACCOUNT.DEPOSIT} component={Deposit} />
            <Route exact path={config.routes.MY_ACCOUNT.WITHDRAW} component={Withdraw} />
            <Route exact path={config.routes.MY_ACCOUNT.DASHBOARD} component={MyAccount} />
            <Route exact path={config.routes.MY_ACCOUNT.OPERATOR} component={SingleOperator} />
            <Route exact path={config.routes.MY_ACCOUNT.VALIDATOR} component={SingleValidator} />
            <Route exact path={config.routes.MY_ACCOUNT.ENABLE_ACCOUNT} component={EnableAccount} />
            <Route exact path={config.routes.MY_ACCOUNT.EDIT_VALIDATOR} component={EditValidator} />
            <Route exact path={config.routes.MY_ACCOUNT.OPERATOR_UPDATE_FEE} component={UpdateFee} />
            <Route exact path={config.routes.MY_ACCOUNT.REMOVE_OPERATOR} component={RemoveOperator} />
            <Route exact path={config.routes.MY_ACCOUNT.OPERATOR_REMOVED} component={OperatorRemoved} />
            <Route exact path={config.routes.MY_ACCOUNT.UPLOAD_KEY_STORE} component={UploadKeyStore} />
            <Route exact path={config.routes.MY_ACCOUNT.REMOVE_VALIDATOR} component={RemoveValidator} />
            <Route exact path={config.routes.MY_ACCOUNT.VALIDATOR_REMOVED} component={ProductQuestions} />
            <Route exact path={config.routes.MY_ACCOUNT.CONFIRM_OPERATORS} component={ConfirmOperatorsChange} />
          </Switch>
        </Route>
        <Route path={config.routes.OPERATOR.HOME}>
          <Switch>
            <Route exact path={config.routes.OPERATOR.HOME} component={RegisterOperatorHome} />
            <Route exact path={config.routes.OPERATOR.SUCCESS_PAGE} component={OperatorSuccessPage} />
            <Route exact path={config.routes.OPERATOR.GENERATE_KEYS} component={GenerateOperatorKeys} />
            <Route exact path={config.routes.OPERATOR.SET_FEE_PAGE} component={SetOperatorFee} />
            <Route exact path={config.routes.OPERATOR.CONFIRMATION_PAGE} component={OperatorTransactionConfirmation} />
          </Switch>
        </Route>

        <Route path={config.routes.VALIDATOR.HOME}>
          <Switch>
            <Route exact path={config.routes.VALIDATOR.CREATE} component={CreateValidator} />
            <Route exact path={config.routes.VALIDATOR.IMPORT} component={ImportValidator} />
            <Route exact path={config.routes.VALIDATOR.HOME} component={RegisterValidatorHome} />
            <Route exact path={config.routes.VALIDATOR.SUCCESS_PAGE} component={SuccessScreen} />
            <Route exact path={config.routes.VALIDATOR.SELECT_OPERATORS} component={SelectOperators} />
            <Route exact path={config.routes.VALIDATOR.SLASHING_WARNING} component={SlashingWarning} />
            <Route exact path={config.routes.VALIDATOR.DEPOSIT_VALIDATOR} component={DepositViaLaunchpad} />
            <Route exact path={config.routes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE} component={AccountBalanceAndFee} />
            <Route exact path={config.routes.VALIDATOR.CONFIRMATION_PAGE} component={ValidatorTransactionConfirmation} />
          </Switch>
        </Route>
      </Layout>
    );
};

export default observer(Routes);