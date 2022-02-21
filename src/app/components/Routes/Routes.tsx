import React from 'react';
import { observer } from 'mobx-react';
import { Route, Switch, Redirect } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/common/components/Layout';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import Claim from '~app/components/Distribution/components/Claim';
import Welcome from '~app/components/Distribution/components/Welcome';
import DistributionStore from '~app/common/stores/Distribution.store';
import Success from '~app/components/Distribution/components/Success';

const Routes = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const distributionStore: DistributionStore = stores.Distribution;

    return (
      <Switch>
        <Layout>
          <Route
            exact
            path="*"
            render={() => {
                if (!walletStore.walletConnected) {
                    return <Redirect to="/" />;
                } 
                    return <Redirect to={'/claim/success'} />;
            }}
          />
          {!walletStore.walletConnected && (
            <Route exact path={config.routes.HOME}>
              <Welcome />
            </Route>
          )}
          {walletStore.walletConnected && (
          <Route exact path={config.routes.DISTRIBUTION.CLAIM}>
            <Claim />
          </Route>
          )}
          {walletStore.walletConnected && (distributionStore.userWithdrawRewards || true) && (
            <Route exact path={config.routes.DISTRIBUTION.SUCCESS}>
              <Success />
            </Route>
          )}
        </Layout>
      </Switch>
    );
};

export default observer(Routes);
