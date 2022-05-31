import React from 'react';
import { observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/components/common/Layout/Layout';
import { FaucetAppBar } from '~app/components/common/AppBar';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ConnectWallet from '~app/components/applications/Faucet/ConnectWallet';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';

const Routes: any = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;

    return (
      <Layout>
        <FaucetAppBar />
        <Route exact path={config.routes.COUNTRY_NOT_SUPPORTED} component={CountryNotSupported} />
        {!walletStore.connected && <Route exact path={config.routes.HOME} component={ConnectWallet} />}
      </Layout>
    );
};

export default observer(Routes);