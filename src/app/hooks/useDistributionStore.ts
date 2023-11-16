import { NETWORKS } from '~lib/utils/envHelper';
import { useStores } from '~app/hooks/useStores';
import { DEVELOPER_FLAGS, getLocalStorageFlagValue } from '~lib/utils/developerHelper';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';

export const useDistributionStore = (networkId: number) => {
  const stores = useStores();
  const mainnetStore: DistributionStore = stores.Distribution;
  const testnetStore: DistributionTestnetStore = stores.DistributionTestnet;
  const enableTestingFlow = getLocalStorageFlagValue(DEVELOPER_FLAGS.ENABLE_TEST_DISTRIBUTION_FLOW);
  const currentFlow = enableTestingFlow ? enableTestingFlow : networkId;

  const distributionStores = {
    [NETWORKS.GOERLI]: testnetStore,
    [NETWORKS.MAINNET]: mainnetStore,
  };

  return distributionStores[currentFlow];
};
