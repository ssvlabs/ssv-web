
import { useStores } from '~app/hooks/useStores';
import { DEVELOPER_FLAGS, getLocalStorageFlagValue } from '~lib/utils/developerHelper';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';
import { HOLESKY_NETWORK_ID } from '~root/providers/networkInfo.provider';

export const useDistributionStore = (networkId: number) => {
  const stores = useStores();
  const mainnetStore: DistributionStore = stores.Distribution;
  const enableTestingFlow = getLocalStorageFlagValue(DEVELOPER_FLAGS.ENABLE_TEST_DISTRIBUTION_FLOW);
  const currentFlow: number = enableTestingFlow ? enableTestingFlow : networkId;

  const distributionStores = {
    [`${HOLESKY_NETWORK_ID}`]: mainnetStore,
  };

  return distributionStores[currentFlow];
};
