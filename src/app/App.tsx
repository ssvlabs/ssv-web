import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Grid, MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from '~app/components/Routes';
import { useStyles } from '~app/App.styles';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar';
import SsvStore from '~app/common/stores/SSV.store';
import BarMessage from '~app/common/components/BarMessage';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApplicationStore from '~app/common/stores/Application.store';

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
    const applicationStore: ApplicationStore = stores.Application;
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

    const GlobalStyle = createGlobalStyle`
      body {
        background-color: ${applicationStore.isDarkMode ? '#011627' : '#f4f7fa'};
        font-family: 'Manrope', sans-serif;
      }`;

    return (
      <MuiThemeProvider theme={applicationStore.muiTheme}>
        <GlobalStyle />
        {triggerLoader && (
          <Grid container className={classes.LoaderWrapper}>
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
        )}
        <BarMessage />
        <AppBar />
        <Routes />
        <CssBaseline />
      </MuiThemeProvider>
    );
};

export default observer(App);
