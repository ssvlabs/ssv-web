import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';

const Routes = () => {
    const stores = useStores();
    const [{ wallet, connecting }] = useConnectWallet();
    const [{ connectedChain }] = useSetChain();
    const applicationStore: ApplicationStore = stores.Application;
    const walletStore: WalletStore = stores.Wallet;
    const ApplicationRoutes = applicationStore.applicationRoutes();

    useEffect(() => {
      if (connectedChain && wallet?.accounts[0]) {
        walletStore.initWallet(wallet, connectedChain);
      }
      if (!wallet?.accounts[0]) {
        walletStore.initWallet(null, null);
      }
    }, [wallet?.accounts[0], connectedChain?.id]);

    return <ApplicationRoutes />;
};

export default observer(Routes);
