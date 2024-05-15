
import { Route, Routes as Wrapper } from 'react-router-dom';
import config from '~app/common/config';
import Layout from '~app/components/common/Layout/Layout';
import Claim from '~app/components/applications/Distribution/components/Claim/Claim';
import Success from '~app/components/applications/Distribution/components/Success/Success';
import DistributionWelcome from '~app/components/applications/Distribution/components/Welcome/Welcome';
import CountryNotSupported from '~app/components/applications/SSV/CountryNotSupported/CountryNotSupported';
import AppBar from '~app/components/common/AppBar/AppBar';
import { HOLESKY_NETWORK_ID } from '~root/providers/networkInfo.provider';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';

const DistributionRoutes: any = () => {
  const accountAddress = useAppSelector(getAccountAddress);

  return (
    <Layout>
      <AppBar excludeNetworks={[HOLESKY_NETWORK_ID]} />
      <Wrapper>
        <Route path={config.routes.COUNTRY_NOT_SUPPORTED} element={<CountryNotSupported/>}/>
        {accountAddress && <Route path={config.routes.DISTRIBUTION.ROOT} element={<Claim/>}/>}
        {!accountAddress && <Route path={config.routes.DISTRIBUTION.ROOT} element={<DistributionWelcome/>}/>}
        <Route path={config.routes.DISTRIBUTION.SUCCESS} element={<Success/>}/>
      </Wrapper>
    </Layout>
  );
};

export default DistributionRoutes;
