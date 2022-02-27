import React from 'react';
import { observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/common/components/Layout/Layout';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import Claim from '~app/components/Distribution/components/Claim/Claim';
import Success from '~app/components/Distribution/components/Success/Success';
import DistributionWelcome from '~app/components/Distribution/components/Welcome/Welcome';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';

const Routes: any = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const distributionStore: DistributionStore = stores.Distribution;

    return (
      <Switch>
        <Layout>
          {!walletStore.connected && (
            <Route exact path={config.routes.DISTRIBUTION.CLAIM}>
              <DistributionWelcome />
            </Route>
            )}
          {walletStore.connected && (
            <Route exact path={config.routes.DISTRIBUTION.CLAIM}>
              <Claim />
            </Route>
            )}
          {(distributionStore.userWithdrawRewards || true) && (
            <Route exact path={config.routes.DISTRIBUTION.SUCCESS}>
              <Success />
            </Route>
            )}
        </Layout>
      </Switch>
    );
};

export default observer(Routes);