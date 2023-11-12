import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import EligibleScreen from '~app/components/applications/Distribution/components/Claim/EligibleScreen';
import NotEligibleScreen from '~app/components/applications/Distribution/components/Claim/NotEligibleScreen';

const CLAIM_FLOW = {
  NOT_ELIGIBLE: 0,
  ELIGIBLE: 1,
};

const Claim = () => {
  const stores = useStores();
  const distributionStore: DistributionStore = stores.Distribution;
  const [currentClaimFlow, setCurrentClaimFlow] = useState(distributionStore.userAddress ? CLAIM_FLOW.ELIGIBLE : CLAIM_FLOW.NOT_ELIGIBLE);

  useEffect(() => {
    setCurrentClaimFlow(distributionStore.userAddress ? CLAIM_FLOW.ELIGIBLE : CLAIM_FLOW.NOT_ELIGIBLE);
  }, [distributionStore.toString()]);

  const components = {
    [CLAIM_FLOW.ELIGIBLE]: EligibleScreen,
    [CLAIM_FLOW.NOT_ELIGIBLE]: NotEligibleScreen,
  };


  const Component = components[currentClaimFlow];

  return (
    <Component/>
  );
};

export default observer(Claim);
