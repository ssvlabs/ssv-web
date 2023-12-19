import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { initGetterContract, initSetterContract, initSsvContract } from '~root/services/contracts.service';

const Routes = () => {
    const stores = useStores();
    const [{ wallet, connecting }] = useConnectWallet();
    const [{ connectedChain }] = useSetChain();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;
    const ApplicationRoutes = applicationStore.applicationRoutes();

    useEffect(() => {
      if (connectedChain && wallet?.accounts[0] && !walletStore.wallet) {
        walletStore.initWallet(wallet, connectedChain);
      }
    }, [wallet?.accounts[0], connectedChain]);

  useEffect(() => {
    if (wallet?.provider) {
      console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<< contracts initiation >>>>>>>>>>>>>>>>>>>>>>>>>>');
      initGetterContract({ provider: wallet.provider });
      initSetterContract({ provider: wallet.provider });
      initSsvContract({ provider: wallet.provider });
      walletStore.initializeUserInfo();
    }
  }, [wallet?.provider]);

    return <ApplicationRoutes />;
};

export default Routes;
