import React from 'react';
import { observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/components/common/Layout/Layout';
import { FaucetAppBar } from '~app/components/common/AppBar';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SuccessPage from '~app/components/applications/Faucet/SuccessPage';
import ConnectWallet from '~app/components/applications/Faucet/ConnectWallet';
import RequestForSsv from '~app/components/applications/Faucet/RequestForSsv';
import FaucetDepleted from '~app/components/applications/Faucet/FaucetDepleted';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';

const Routes: any = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;

    return (
      <Layout>
        <FaucetAppBar />
        <Route exact path={config.routes.COUNTRY_NOT_SUPPORTED} component={CountryNotSupported} />
        {!walletStore.connected && <Route exact path={config.routes.HOME} component={ConnectWallet} />}
        {walletStore.connected && <Route exact path={config.routes.HOME} component={RequestForSsv} />}
        {walletStore.connected && <Route exact path={config.routes.FAUCET.DEPLETED} component={FaucetDepleted} />}
        {walletStore.connected && <Route exact path={config.routes.FAUCET.SUCCESS} component={SuccessPage} />}
      </Layout>
    );
};

export default observer(Routes);