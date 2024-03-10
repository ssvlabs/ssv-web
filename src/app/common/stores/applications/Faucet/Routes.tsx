import React from 'react';
import { observer } from 'mobx-react';
import { Route, Routes as Wrapper } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Layout from '~app/components/common/Layout/Layout';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SuccessPage from '~app/components/applications/Faucet/SuccessPage';
import ConnectWallet from '~app/components/applications/Faucet/ConnectWallet';
import RequestForSsv from '~app/components/applications/Faucet/RequestForSsv';
import FaucetDepleted from '~app/components/applications/Faucet/FaucetDepleted';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';
import AppBar from '~app/components/common/AppBar/AppBar';
import { MAINNET_NETWORK_ID } from '~root/providers/networkInfo.provider';

const Routes: any = () => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;

  return (
    <Layout>
      <AppBar excludeNetworks={[MAINNET_NETWORK_ID]} />
      <Wrapper>
        <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported />} />
        {walletStore.wallet && <Route path={config.routes.FAUCET.ROOT} element={<RequestForSsv />} />}
        {walletStore.wallet && <Route path={config.routes.FAUCET.SUCCESS} element={<SuccessPage />} />}
        {!walletStore.wallet && <Route path={config.routes.FAUCET.ROOT} element={<ConnectWallet />} />}
        {walletStore.wallet && <Route path={config.routes.FAUCET.DEPLETED} element={<FaucetDepleted />} />}
      </Wrapper>
    </Layout>
  );
};

export default observer(Routes);
