import { useStores } from '~app/hooks/useStores';
import { DEVELOPER_FLAGS, getLocalStorageFlagValue } from '~lib/utils/developerHelper';
import { HOLESKY_NETWORK_ID } from '~root/providers/networkInfo.provider';

export const useDistributionStore = (networkId: number) => {
  const stores = useStores();
  const mainnetStore = stores.Distribution;
  const enableTestingFlow = getLocalStorageFlagValue(DEVELOPER_FLAGS.ENABLE_TEST_DISTRIBUTION_FLOW);
  const currentFlow: string = enableTestingFlow ? enableTestingFlow : networkId;

  const distributionStores = {
    [`${HOLESKY_NETWORK_ID}`]: mainnetStore
  };

  return distributionStores[currentFlow as keyof typeof distributionStores];
};
