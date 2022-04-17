import React from 'react';
import { observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/common/components/Layout/Layout';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import Claim from '~app/components/Distribution/components/Claim/Claim';
import Success from '~app/components/Distribution/components/Success/Success';
import DistributionWelcome from '~app/components/Distribution/components/Welcome/Welcome';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import AppBar from '~app/common/components/AppBar/AppBar';

const Routes: any = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const distributionStore: DistributionStore = stores.Distribution;

    return (
      <Layout>
        <AppBar />
        {walletStore.connected && <Route exact path={config.routes.DISTRIBUTION.CLAIM} component={Claim} />}
        {!walletStore.connected && <Route exact path={config.routes.DISTRIBUTION.CLAIM} component={DistributionWelcome} />}
        {distributionStore.userWithdrawRewards && <Route exact path={config.routes.DISTRIBUTION.SUCCESS} component={Success} />}
      </Layout>
    );
};

export default observer(Routes);