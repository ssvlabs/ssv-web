import { observer } from 'mobx-react';
import { configure } from 'mobx';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InitOptions, OnboardAPI } from '@web3-onboard/core';
import { Web3OnboardProvider, init } from '@web3-onboard/react';
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
import BarMessage from '~app/components/common/BarMessage';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { checkUserCountryRestriction } from '~lib/utils/compliance';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import MobileNotSupported from '~app/components/common/MobileNotSupported';
import DeveloperHelper from '~lib/utils/developerHelper';
import { tmp } from '~lib/utils/onboardHelper';

const onboardInstance = init(tmp);

configure({ enforceActions: 'never' });

document.title = 'SSV Network';
if (process.env.REACT_APP_FAUCET_PAGE) {
  document.title = 'SSV Network Faucet';
} if (process.env.REACT_APP_CLAIM_PAGE) {
  document.title = 'SSV Network Distribution';
}

const App = () => {
  const [web3Onboard, setWeb3Onboard] = useState<OnboardAPI | null>(null);
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalStyle = globalStyle();
  const applicationStore: ApplicationStore = stores.Application;

  const location = useLocation();

  useEffect(() => {
    setWeb3Onboard(onboardInstance);
  }, []);

  useEffect(() => {
    if (window?.localStorage.getItem('locationRestrictionDisabled')) {
      console.debug('Skipping location restriction functionality in this app.');
      applicationStore.userGeo = '';
    } else {
      if (applicationStore.shouldCheckCompliance) {
        checkUserCountryRestriction().then((res: any) => {
          if (res.restricted) {
            applicationStore.userGeo = res.userGeo;
            applicationStore.strategyRedirect = config.routes.COUNTRY_NOT_SUPPORTED;
            navigate(config.routes.COUNTRY_NOT_SUPPORTED);
          } else {
            navigate(applicationStore.strategyRedirect);
          }
        });
      } else {
        if (location.pathname === config.routes.COUNTRY_NOT_SUPPORTED) {
          applicationStore.userGeo = '';
          applicationStore.strategyRedirect = config.routes.SSV.ROOT;
          navigate(applicationStore.strategyRedirect);
        }
      }
    }
  }, [applicationStore.shouldCheckCompliance]);

  return (
      <StyledEngineProvider injectFirst>
        <DeveloperHelper />
        <ThemeProvider theme={applicationStore.theme}>
          <ThemeProviderLegacy theme={applicationStore.theme}>
            <GlobalStyle/>
            {!web3Onboard && (
                <Grid container className={classes.LoaderWrapper}>
                  <img className={classes.Loader} src={getImage('ssv-loader.svg')} alt=""/>
                </Grid>
            )}
            <BarMessage/>
            <BrowserView>
              {web3Onboard && <Web3OnboardProvider web3Onboard={web3Onboard}><Routes/></Web3OnboardProvider>}
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
