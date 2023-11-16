import { DISTRIBUTION_ABI_VERSION } from '~app/common/config/abi';
import { getCurrentNetwork, NETWORKS } from '~lib/utils/envHelper';
import { DEVELOPER_FLAGS, getLocalStorageFlagValue } from '~lib/utils/developerHelper';

const DISTRIBUTION = 'Distribution';
const DISTRIBUTION_TESTNET = 'DistributionTestnet';
const DISTRIBUTION_TESTING_CONTRACT = 'distributionTestingContract';

export const distributionHelper = (networkId: number) => {
  const { distributionContract } = getCurrentNetwork();
  let abi = DISTRIBUTION_ABI_VERSION[networkId];
  let contract = distributionContract;
  let currentFlow = networkId;
  let storeName = (networkId) === NETWORKS.MAINNET ? DISTRIBUTION : DISTRIBUTION_TESTNET;
  const enableDistributionTestingFlow = getLocalStorageFlagValue(DEVELOPER_FLAGS.ENABLE_TEST_DISTRIBUTION_FLOW);

  if (enableDistributionTestingFlow) {
      const testingContract = window.localStorage.getItem(DISTRIBUTION_TESTING_CONTRACT);
      currentFlow = enableDistributionTestingFlow;
      contract = testingContract;
      abi = DISTRIBUTION_ABI_VERSION[currentFlow];
      storeName = DISTRIBUTION;
  }

  return { abi, contract, storeName };
};
