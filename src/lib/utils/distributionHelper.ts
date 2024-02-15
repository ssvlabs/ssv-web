import { DISTRIBUTION_ABI_VERSION } from '~app/common/config/abi';
import { DEVELOPER_FLAGS } from '~lib/utils/developerHelper';
import { NETWORKS } from '~root/providers/networkInfo.provider';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider';

const DISTRIBUTION = 'Distribution';
const DISTRIBUTION_TESTNET = 'DistributionTestnet';
const DISTRIBUTION_TESTING_CONTRACT = 'distributionTestingContract';

export const distributionHelper = (networkId: number) => {
  // TODO: refactor
  // const { distributionContract } = getStoredNetwork();
  let abi = DISTRIBUTION_ABI_VERSION[networkId];
  // let contract = distributionContract;
  let currentFlow = networkId;
  let storeName = (networkId) === NETWORKS.MAINNET ? DISTRIBUTION : DISTRIBUTION_TESTNET;
  // @ts-ignore
  const enableDistributionTestingFlow = JSON.parse(getFromLocalStorageByKey(DEVELOPER_FLAGS.ENABLE_TEST_DISTRIBUTION_FLOW));

  if (enableDistributionTestingFlow) {
      const testingContract = window.localStorage.getItem(DISTRIBUTION_TESTING_CONTRACT);
      currentFlow = enableDistributionTestingFlow;
      // contract = testingContract;
      abi = DISTRIBUTION_ABI_VERSION[currentFlow];
      storeName = DISTRIBUTION;
  }

  return {
    abi,
    // contract,
    storeName,
  };
};
