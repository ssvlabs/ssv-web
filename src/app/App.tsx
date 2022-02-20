import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Grid, MuiThemeProvider } from '@material-ui/core';
import { MobileView, BrowserView } from 'react-device-detect';
import Routes from '~app/components/Routes';
import { useStyles } from '~app/App.styles';
import { globalStyle } from '~app/globalStyle';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import AppBar from '~app/common/components/AppBar';
import SsvStore from '~app/common/stores/SSV.store';
import BarMessage from '~app/common/components/BarMessage';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ApplicationStore from '~app/common/stores/Application.store';
import MobileNotSupported from '~app/components/MobileNotSupported';

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
    const GlobalStyle = globalStyle();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        walletStore.connectWalletFromCache();
    }, []);

    useEffect(() => {
        if (walletStore.walletConnected && ssvStore.accountLoaded) {
            history.push('/dashboard');
        } else if (ssvStore.accountLoaded) {
            history.push(window.location);
        }
    }, [walletStore.walletConnected, ssvStore.accountLoaded]);

    return (
      <MuiThemeProvider theme={applicationStore.muiTheme}>
        <GlobalStyle />
        {!ssvStore.accountLoaded && (
          <Grid container className={classes.LoaderWrapper}>
            <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
          </Grid>
        )}
        <BarMessage />
        <AppBar />
        <BrowserView>
          <Routes />
        </BrowserView>
        <MobileView>
          <MobileNotSupported />
        </MobileView>
        <CssBaseline />
      </MuiThemeProvider>
    );
};

export default observer(App);
