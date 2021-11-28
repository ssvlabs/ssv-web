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
// import PopupMessage from '~app/common/components/PopupMessage';
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
    const [triggerLoader, shouldTriggerLoader] = useState(true);

    useEffect(() => {
        walletStore.checkConnection();
    }, []);

    useEffect(() => {
        if (!triggerLoader) shouldTriggerLoader(true);
        if (walletStore.walletConnected && ssvStore.accountLoaded && (!!ssvStore.userOperators.length || !!ssvStore.userValidators.length)) {
            history.push('/dashboard');
            shouldTriggerLoader(false);
        } else if (ssvStore.accountLoaded) {
            history.push('/');
            shouldTriggerLoader(false);
        }
    }, [walletStore.walletConnected, ssvStore.accountLoaded]);

    return (
      <>
        {triggerLoader && (
        <Grid container className={classes.LoaderWrapper}>
          <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
        </Grid>
        )}
        <BarMessage />
        <AppBar />
        <Routes />
        <CssBaseline />
      </>
    );
};

export default observer(App);
