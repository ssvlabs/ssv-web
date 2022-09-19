import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Grid, MuiThemeProvider } from '@material-ui/core';
import { BrowserView, MobileView } from 'react-device-detect';
import Routes from '~app/Routes/Routes';
import config from '~app/common/config';
import { useStyles } from '~app/App.styles';
import { globalStyle } from '~app/globalStyle';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import BarMessage from '~app/components/common/BarMessage';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { checkUserCountryRestriction } from '~lib/utils/compliance';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import MobileNotSupported from '~app/components/common/MobileNotSupported';

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
  const walletStore: WalletStore = stores.Wallet;
  const applicationStore: ApplicationStore = stores.Application;

  useEffect(() => {
    document.title = applicationStore.appTitle;
  });

  useEffect(() => {
    if (!applicationStore.locationRestrictionEnabled) {
      walletStore.connectWalletFromCache();
      return;
    }
    checkUserCountryRestriction().then((res: any) => {
      if (res.restricted) {
        walletStore.accountDataLoaded = true;
        applicationStore.userGeo = res.userGeo;
        applicationStore.strategyRedirect = config.routes.COUNTRY_NOT_SUPPORTED;
        history.push(config.routes.COUNTRY_NOT_SUPPORTED);
      } else {
        walletStore.connectWalletFromCache();
      }
    });
  }, []);

  useEffect(() => {
    if (walletStore.accountDataLoaded) {
      history.push(applicationStore.strategyRedirect);
    }
  }, [walletStore.accountDataLoaded]);

  return (
    <MuiThemeProvider theme={applicationStore.theme}>
      <GlobalStyle />
      {!walletStore.accountDataLoaded && (
        <Grid container className={classes.LoaderWrapper}>
          <img className={classes.Loader} src={getImage('ssv-loader.svg')} />
        </Grid>
      )}
      <BarMessage />
      {/* <AppBar /> */}
      <BrowserView>
        {walletStore.accountDataLoaded && <Routes />}
      </BrowserView>
      <MobileView>
        <MobileNotSupported />
      </MobileView>
      <CssBaseline />
    </MuiThemeProvider>
  );
};

export default observer(App);
