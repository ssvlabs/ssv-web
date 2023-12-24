import * as SsvRoutes from '~app/common/stores/applications/SsvWeb/Routes';
import * as FaucetRoutes from '~app/common/stores/applications/Faucet/Routes';
import * as DistributionRoutes from '~app/common/stores/applications/Distribution/Routes';

let AppRoutes = SsvRoutes;

if (process.env.REACT_APP_FAUCET_PAGE) {
    AppRoutes = FaucetRoutes;
} if (process.env.REACT_APP_CLAIM_PAGE) {
    AppRoutes = DistributionRoutes;
}


const Routes = () => AppRoutes;

export default Routes;
