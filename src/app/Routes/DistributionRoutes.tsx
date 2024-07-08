import { Route, Routes as Wrapper } from 'react-router-dom';
import { useAccount } from 'wagmi';
import config from '~app/common/config';
import Claim from '~app/components/applications/Distribution/components/Claim/Claim';
import Success from '~app/components/applications/Distribution/components/Success/Success';
import DistributionWelcome from '~app/components/applications/Distribution/components/Welcome/Welcome';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';
import AppBar from '~app/components/common/AppBar/AppBar';
import Layout from '~app/components/common/Layout/Layout';

const DistributionRoutes: any = () => {
  const { isConnected } = useAccount();

  return (
    <Layout>
      <AppBar />
      <Wrapper>
        <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported />} />
        {isConnected && <Route path={config.routes.DISTRIBUTION.ROOT} element={<Claim />} />}
        {!isConnected && <Route path={config.routes.DISTRIBUTION.ROOT} element={<DistributionWelcome />} />}
        <Route path={config.routes.DISTRIBUTION.SUCCESS} element={<Success />} />
      </Wrapper>
    </Layout>
  );
};

export default DistributionRoutes;
