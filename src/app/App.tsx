import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from '~app/components/Routes';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar';
import BarMessage from '~app/common/components/BarMessage';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const App = () => {
    const stores = useStores();
    const history = useHistory();
    const walletStore: WalletStore = stores.Wallet;
    const [connectionChecked, setConnection] = useState(false);
  
    React.useEffect(() => {
        walletStore.checkConnection().then(() => {
            if (walletStore.walletConnected) {
                history.push('/dashboard');
            }
            setConnection(true);
        });
    }, []);

    if (connectionChecked) {
        return (
          <>
            <BarMessage />
            <AppBar />
            <Routes />
            <CssBaseline />
          </>
        );
    }
    return (
      <>
      </>
    );
};

export default observer(App);
