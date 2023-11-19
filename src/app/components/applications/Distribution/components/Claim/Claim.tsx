import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '~app/hooks/useStores';
import { getCurrentNetwork } from '~lib/utils/envHelper';
import { useDistributionStore } from '~app/hooks/useDistributionStore';
import WalletStore from '~app/common/stores/applications/Distribution/Wallet.store';
import DistributionStore from '~app/common/stores/applications/Distribution/Distribution.store';
import EligibleScreen from '~app/components/applications/Distribution/components/Claim/EligibleScreen';
import NotEligibleScreen from '~app/components/applications/Distribution/components/Claim/NotEligibleScreen';
import DistributionTestnetStore from '~app/common/stores/applications/Distribution/DistributionTestnet.store';

const CLAIM_FLOW = {
  NOT_ELIGIBLE: 0,
  ELIGIBLE: 1,
};

const Claim = () => {
  const stores = useStores();
  const { networkId } = getCurrentNetwork();
  const distributionStore: DistributionStore | DistributionTestnetStore = useDistributionStore(networkId);
  const walletStore: WalletStore = stores.Wallet;
  const [currentClaimFlow, setCurrentClaimFlow] = useState(distributionStore.userAddress ? CLAIM_FLOW.ELIGIBLE : CLAIM_FLOW.NOT_ELIGIBLE);

  console.log(distributionStore);

  useEffect(() => {
    setCurrentClaimFlow(distributionStore.userAddress ? CLAIM_FLOW.ELIGIBLE : CLAIM_FLOW.NOT_ELIGIBLE);
  }, [walletStore.accountAddress]);

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
