import SsvRoutes from '~app/common/stores/applications/SsvWeb/Routes';
import FaucetRoutes from '~app/common/stores/applications/Faucet/Routes';
import DistributionRoutes from '~app/common/stores/applications/Distribution/Routes';

let AppRoutes = SsvRoutes;

if (process.env.REACT_APP_FAUCET_PAGE) {
    AppRoutes = FaucetRoutes;
} if (process.env.REACT_APP_CLAIM_PAGE) {
    AppRoutes = DistributionRoutes;
}
export default AppRoutes;
