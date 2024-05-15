import DistributionRoutes from './DistributionRoutes';
import FaucetRoutes from './FaucetRoutes';
import SsvRoutes from './SsvWebRoutes';

let AppRoutes = SsvRoutes;

if (import.meta.env.VITE_FAUCET_PAGE) {
    AppRoutes = FaucetRoutes;
} if (import.meta.env.VITE_CLAIM_PAGE) {
    AppRoutes = DistributionRoutes;
}
export default AppRoutes;
