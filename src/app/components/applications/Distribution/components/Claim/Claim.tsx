import { useEffect, useState } from 'react';
import { useDistributionStore } from '~app/hooks/useDistributionStore';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import EligibleScreen from '~app/components/applications/Distribution/components/Claim/EligibleScreen';
import NotEligibleScreen from '~app/components/applications/Distribution/components/Claim/NotEligibleScreen';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';

const CLAIM_FLOW = {
  NOT_ELIGIBLE: 0,
  ELIGIBLE: 1
};

const Claim = () => {
  const accountAddress = useAppSelector(getAccountAddress);
  const { networkId } = getStoredNetwork();
  const distributionStore: DistributionStore | DistributionTestnetStore =
    useDistributionStore(networkId);
  const [currentClaimFlow, setCurrentClaimFlow] = useState(
    distributionStore.userAddress
      ? CLAIM_FLOW.ELIGIBLE
      : CLAIM_FLOW.NOT_ELIGIBLE
  );

  console.log(distributionStore);

  useEffect(() => {
    setCurrentClaimFlow(
      distributionStore.userAddress
        ? CLAIM_FLOW.ELIGIBLE
        : CLAIM_FLOW.NOT_ELIGIBLE
    );
  }, [accountAddress]);

  const components = {
    [CLAIM_FLOW.ELIGIBLE]: EligibleScreen,
    [CLAIM_FLOW.NOT_ELIGIBLE]: NotEligibleScreen
  };

  const Component = components[currentClaimFlow];

  return <Component />;
};

export default Claim;
