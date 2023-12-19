import React, { useEffect } from 'react';
// import { observer } from 'mobx-react';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { getNetworkFees, initGetterContract, initSetterContract, initSsvContract } from '~root/services/contracts.service';

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
        console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<< wallet connecting? >>>>>>>>>>>>>>>>>>>>>>>>>>', connecting);

        setTimeout(() => {
          console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<< contracts initiation >>>>>>>>>>>>>>>>>>>>>>>>>>');
          initGetterContract({ provider: wallet.provider });
          initSetterContract({ provider: wallet.provider });
          initSsvContract({ provider: wallet.provider });
          walletStore.initializeUserInfo();
        }, 0);
      }
    }, [wallet?.accounts[0], connectedChain]);

    return <ApplicationRoutes />;
};

export default Routes;
