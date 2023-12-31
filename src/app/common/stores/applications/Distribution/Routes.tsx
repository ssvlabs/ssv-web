import React from 'react';
import { observer } from 'mobx-react';
import { Route, Routes as Wrapper } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/components/common/Layout/Layout';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { DistributionAppBar } from '~app/components/common/AppBar';
import Claim from '~app/components/applications/Distribution/components/Claim/Claim';
import Success from '~app/components/applications/Distribution/components/Success/Success';
import DistributionWelcome from '~app/components/applications/Distribution/components/Welcome/Welcome';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';

const Routes: any = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;

  return (
    <Layout>
      <DistributionAppBar/>
      <Wrapper>
        <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported/>}/>
        {walletStore.wallet && <Route path={config.routes.DISTRIBUTION.ROOT} element={<Claim/>}/>}
        {!walletStore.wallet && <Route path={config.routes.DISTRIBUTION.ROOT} element={<DistributionWelcome/>}/>}
        <Route path={config.routes.DISTRIBUTION.SUCCESS} element={<Success/>}/>
      </Wrapper>
    </Layout>
  );
};

export default observer(Routes);
