import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';
import { ThemeProvider as ThemeProviderLegacy } from '@mui/styles';
import Routes from '~app/Routes/Routes';
import config from '~app/common/config';
import { useStyles } from '~app/App.styles';
import { globalStyle } from '~app/globalStyle';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import DeveloperHelper from '~lib/utils/developerHelper';
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
  const navigate = useNavigate();
  const GlobalStyle = globalStyle();
  const walletStore: WalletStore = stores.Wallet;
  const applicationStore: ApplicationStore = stores.Application;

  useEffect(() => {
    document.title = applicationStore.appTitle;
  });

  useEffect(() => {
    if (!applicationStore.locationRestrictionEnabled) {
      console.debug('Skipping location restriction functionality in this app.');
      walletStore.connectWalletFromCache();
    } else {
      checkUserCountryRestriction().then((res: any) => {
        if (res.restricted) {
          walletStore.accountDataLoaded = true;
          applicationStore.userGeo = res.userGeo;
          applicationStore.strategyRedirect = config.routes.COUNTRY_NOT_SUPPORTED;
          navigate(config.routes.COUNTRY_NOT_SUPPORTED);
        } else {
          walletStore.connectWalletFromCache();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (walletStore.accountDataLoaded) {
      navigate(applicationStore.strategyRedirect);
    }
  }, [walletStore.accountDataLoaded]);

  return (
      <StyledEngineProvider injectFirst>
        <DeveloperHelper />
        <ThemeProvider theme={applicationStore.theme}>
          <ThemeProviderLegacy theme={applicationStore.theme}>
            <GlobalStyle/>
            {!walletStore.accountDataLoaded && (
                <Grid container className={classes.LoaderWrapper}>
                  <img className={classes.Loader} src={getImage('ssv-loader.svg')}/>
                </Grid>
            )}
            <BarMessage/>
            <BrowserView>
              {walletStore.accountDataLoaded && <Routes/>}
            </BrowserView>
            <MobileView>
              <MobileNotSupported/>
            </MobileView>
            <CssBaseline/>
          </ThemeProviderLegacy>
        </ThemeProvider>
      </StyledEngineProvider>
  );
};

export default observer(App);
