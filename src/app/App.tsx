import React from 'react';
import { observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Main from '~app/components/Routes';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const App = () => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    React.useEffect(() => {
        walletStore.checkConnection();
    }, []);
  return (
    <>
      <AppBar />
      <Main />
      <CssBaseline />
    </>
  );
};

export default observer(App);
