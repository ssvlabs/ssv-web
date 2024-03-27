import DistributionRoutes from './DistributionRoutes';
import FaucetRoutes from './FaucetRoutes';
import SsvRoutes from './SsvWebRoutes';

let AppRoutes = SsvRoutes;

if (process.env.REACT_APP_FAUCET_PAGE) {
    AppRoutes = FaucetRoutes;
} if (process.env.REACT_APP_CLAIM_PAGE) {
    AppRoutes = DistributionRoutes;
}
export default AppRoutes;
