import { useEffect } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';
import { mixpanel } from '~root/mixpanel';

export const useIdentify = () => {
  const { address } = useAccount();
  useAccountEffect({
    onDisconnect: () => mixpanel.reset()
  });
  useEffect(() => {
    if (address) mixpanel.identify(address);
  }, [address]);
};
