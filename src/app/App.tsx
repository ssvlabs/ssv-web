import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from '~app/components/Routes';
import { useStyles } from '~app/App.styles';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar';
import SsvStore from '~app/common/stores/SSV.store';
import BarMessage from '~app/common/components/BarMessage';
import PopupMessage from '~app/common/components/PopupMessage';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const App = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [connectionChecked, setConnection] = useState(false);

    useEffect(() => {
        walletStore.checkConnection();
    }, []);

    useEffect(() => {
        if (walletStore.walletConnected && ssvStore.dataLoaded && (!!ssvStore.userOperators.length || !!ssvStore.userValidators.length)) {
            history.push('/dashboard');
            setConnection(true);
        } else if (ssvStore.dataLoaded) {
            history.push('/');
            setConnection(true);
        }
    }, [walletStore.walletConnected, ssvStore.dataLoaded]);

    if (connectionChecked) {
        return (
          <>
            {ssvStore.transactionInProgress && <PopupMessage />}
            <BarMessage />
            <AppBar />
            <Routes />
            <CssBaseline />
          </>
        );
    }

    return (
      <Grid container>
        <img className={classes.LoaderWrapper} src={getImage('ssv-loader.svg')} />
      </Grid>
    );
};

export default observer(App);
