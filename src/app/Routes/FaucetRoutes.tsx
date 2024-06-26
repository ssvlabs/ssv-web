import { Route, Routes as Wrapper } from 'react-router-dom';
import { useAccount } from 'wagmi';
import config from '~app/common/config';
import ConnectWallet from '~app/components/applications/Faucet/ConnectWallet';
import FaucetDepleted from '~app/components/applications/Faucet/FaucetDepleted';
import RequestForSsv from '~app/components/applications/Faucet/RequestForSsv';
import SuccessPage from '~app/components/applications/Faucet/SuccessPage';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';
import AppBar from '~app/components/common/AppBar/AppBar';
import Layout from '~app/components/common/Layout/Layout';

const FaucetRoutes: any = () => {
  const { isConnected } = useAccount();

  return (
    <Layout>
      <AppBar />
      <Wrapper>
        <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported />} />
        {!isConnected && <Route path={config.routes.FAUCET.ROOT} element={<ConnectWallet />} />}
        {isConnected && <Route path={config.routes.FAUCET.ROOT} element={<RequestForSsv />} />}
        {isConnected && <Route path={config.routes.FAUCET.SUCCESS} element={<SuccessPage />} />}
        {isConnected && <Route path={config.routes.FAUCET.DEPLETED} element={<FaucetDepleted />} />}
      </Wrapper>
    </Layout>
  );
};

export default FaucetRoutes;
