import React from 'react';
import { observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import config from '~app/common/config';
import MyAccount from '~app/components/MyAccount';
import Layout from '~app/common/components/Layout';
import Welcome from '~app/components/Welcome/Welcome';
import { SsvAppBar } from '~app/common/components/AppBar';
import SuccessScreen from '~app/components/SuccessScreen';
import Deposit from '~app/components/MyAccount/components/Deposit';
import Withdraw from '~app/components/MyAccount/components/Withdraw';
import GenerateOperatorKeys from '~app/components/GenerateOperatorKeys';
import RegisterOperatorHome from '~app/components/RegisterOperatorHome';
import RegisterValidatorHome from '~app/components/RegisterValidatorHome';
import EnableAccount from '~app/components/MyAccount/components/EnableAccount';
import EditValidator from '~app/components/MyAccount/components/EditValidator';
import SingleOperator from '~app/components/MyAccount/components/SingleOperator';
import UploadKeyStore from '~app/components/MyAccount/components/UploadKeyStore';
import SingleValidator from '~app/components/MyAccount/components/SingelValidator';
import RemoveValidator from '~app/components/MyAccount/components/RemoveValidator';
import OperatorTransactionConfirmation from '~app/components/OperatorConfirmation';
import ProductQuestions from '~app/components/MyAccount/components/ProductQuestions';
import ValidatorTransactionConfirmation from '~app/components/ImportValidatorConfirmation';
import ImportValidator from '~app/components/RegisterValidatorHome/components/ImportValidator';
import CreateValidator from '~app/components/RegisterValidatorHome/components/CreateValidator';
import SlashingWarning from '~app/components/RegisterValidatorHome/components/SlashingWarning';
import SelectOperators from '~app/components/RegisterValidatorHome/components/SelectOperators';
import ConfirmOperatorsChange from '~app/components/MyAccount/components/ConfirmOperatorsChange';
import DepositViaLaunchpad from '~app/components/RegisterValidatorHome/components/DepositViaLaunchpad';
import AccountBalanceAndFee from '~app/components/RegisterValidatorHome/components/AccountBalanceAndFee';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';

const Routes: any = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    if (!walletStore.accountDataLoaded) return <div>Loading...</div>;
    Welcome;
    return (
      <Layout>
        <SsvAppBar />
        {/* <Route exact path={config.routes.HOME} component={Welcome} /> */}
        <Route exact path={config.routes.HOME} component={SingleOperator} />
        <Route path={config.routes.MY_ACCOUNT.DASHBOARD}>
          <Switch>
            <Route exact path={config.routes.MY_ACCOUNT.DEPOSIT} component={Deposit} />
            <Route exact path={config.routes.MY_ACCOUNT.WITHDRAW} component={Withdraw} />
            <Route exact path={config.routes.MY_ACCOUNT.DASHBOARD} component={MyAccount} />
            <Route exact path={config.routes.MY_ACCOUNT.VALIDATOR} component={SingleValidator} />
            <Route exact path={config.routes.MY_ACCOUNT.ENABLE_ACCOUNT} component={EnableAccount} />
            <Route exact path={config.routes.MY_ACCOUNT.EDIT_VALIDATOR} component={EditValidator} />
            <Route exact path={config.routes.MY_ACCOUNT.UPLOAD_KEY_STORE} component={UploadKeyStore} />
            <Route exact path={config.routes.MY_ACCOUNT.REMOVE_VALIDATOR} component={RemoveValidator} />
            <Route exact path={config.routes.MY_ACCOUNT.VALIDATOR_REMOVED} component={ProductQuestions} />
            <Route exact path={config.routes.MY_ACCOUNT.CONFIRM_OPERATORS} component={ConfirmOperatorsChange} />
          </Switch>
        </Route>
        <Route path={config.routes.OPERATOR.HOME}>
          <Switch>
            <Route exact path={config.routes.OPERATOR.HOME} component={RegisterOperatorHome} />
            <Route exact path={config.routes.OPERATOR.SUCCESS_PAGE} component={SuccessScreen} />
            <Route exact path={config.routes.OPERATOR.GENERATE_KEYS} component={GenerateOperatorKeys} />
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