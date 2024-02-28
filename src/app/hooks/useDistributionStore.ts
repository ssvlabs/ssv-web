
import { useStores } from '~app/hooks/useStores';
import { DEVELOPER_FLAGS, getLocalStorageFlagValue } from '~lib/utils/developerHelper';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';
import { GOERLI_NETWORK_ID, HOLESKY_NETWORK_ID } from '~root/providers/networkInfo.provider';

export const useDistributionStore = (networkId: number) => {
  const stores = useStores();
  const mainnetStore: DistributionStore = stores.Distribution;
  const testnetStore: DistributionTestnetStore = stores.DistributionTestnet;
  const enableTestingFlow = getLocalStorageFlagValue(DEVELOPER_FLAGS.ENABLE_TEST_DISTRIBUTION_FLOW);
  const currentFlow: number = enableTestingFlow ? enableTestingFlow : networkId;

  const distributionStores = {
    [`${GOERLI_NETWORK_ID}`]: testnetStore,
    [`${HOLESKY_NETWORK_ID}`]: mainnetStore,
  };

  return distributionStores[currentFlow];
};
