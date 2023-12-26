import { useEffect, useMemo } from 'react';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { initContracts } from '~root/services/contracts.service';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

const useOnboard = () => {
  const stores = useStores();
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();
  const applicationStore: ApplicationStore = stores.Application;
  const walletStore: WalletStore = stores.Wallet;

  useEffect(() => {
    if (connectedChain?.id && wallet?.accounts[0]) {
      console.warn('useOnboard::useEffect: connectedChain?.id && wallet?.accounts[0]', connectedChain?.id, wallet?.accounts[0]);
      // if (wallet.provider) {
      //   initContracts({ provider: wallet.provider, network: getStoredNetwork() });
      //   walletStore.initWallet(wallet, connectedChain);
      // }
    }
  }, [wallet?.accounts[0]?.address, connectedChain?.id]);

  const disconnectWallet = async () => {
    if (wallet) {
      console.warn('useOnboard::disconnectWallet: before');
      await disconnect({ label: wallet.label });
      walletStore.initWallet(null, null);
      console.warn('useOnboard::disconnectWallet: done');
    }
  };

  const isWalletConnect = () => wallet?.label === 'WalletConnect';

  return {
    wallet,
    disconnectWallet,
    isWalletConnect,
    useSetChain,
  };
};

export default useOnboard;
