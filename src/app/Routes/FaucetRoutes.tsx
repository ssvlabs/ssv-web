
import { Route, Routes as Wrapper } from 'react-router-dom';
import config from '~app/common/config';
import Layout from '~app/components/common/Layout/Layout';
import SuccessPage from '~app/components/applications/Faucet/SuccessPage';
import ConnectWallet from '~app/components/applications/Faucet/ConnectWallet';
import RequestForSsv from '~app/components/applications/Faucet/RequestForSsv';
import FaucetDepleted from '~app/components/applications/Faucet/FaucetDepleted';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';
import AppBar from '~app/components/common/AppBar/AppBar';
import { MAINNET_NETWORK_ID } from '~root/providers/networkInfo.provider';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';

const FaucetRoutes: any = () => {
  const accountAddress = useAppSelector(getAccountAddress);

  return (
    <Layout>
      <AppBar excludeNetworks={[MAINNET_NETWORK_ID]} />
      <Wrapper>
        <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported />} />
        {!accountAddress && <Route path={config.routes.FAUCET.ROOT} element={<ConnectWallet />} />}
        {accountAddress && <Route path={config.routes.FAUCET.ROOT} element={<RequestForSsv />} />}
        {accountAddress && <Route path={config.routes.FAUCET.SUCCESS} element={<SuccessPage />} />}
        {accountAddress && <Route path={config.routes.FAUCET.DEPLETED} element={<FaucetDepleted />} />}
      </Wrapper>
    </Layout>
  );
};

export default FaucetRoutes;
