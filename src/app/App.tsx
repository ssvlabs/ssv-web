import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { ThemeProvider as ScThemeProvider } from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';
import { ThemeProvider as ThemeProviderLegacy } from '@mui/styles';
import Routes from '~app/Routes/Routes';
import config from '~app/common/config';
import { globalStyle } from '~app/globalStyle';
import { useStores } from '~app/hooks/useStores';
import BarMessage from '~app/components/common/BarMessage';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { checkUserCountryRestriction } from '~lib/utils/compliance';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import MobileNotSupported from '~app/components/common/MobileNotSupported';
import DeveloperHelper, { DEVELOPER_FLAGS, getLocalStorageFlagValue } from '~lib/utils/developerHelper';
import { getColors } from '~root/themes';
import { ssvLoader } from '../../public/images';

const LoaderWrapper = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background-color: ${({ theme }) => theme.loaderColor};
`;

const Loader = styled.img`
  width: 200px;
`;

const App = () => {
  const [theme, setTheme] = useState<any>({});
  const stores = useStores();
  const navigate = useNavigate();
  const GlobalStyle = globalStyle();
  const walletStore: WalletStore = stores.Wallet;
  const applicationStore: ApplicationStore = stores.Application;
  const location = useLocation();
  const unsafeMode = getLocalStorageFlagValue(DEVELOPER_FLAGS.UPLOAD_KEYSHARE_UNSAFE_MODE) && location.pathname === config.routes.SSV.MY_ACCOUNT.KEYSHARE_UPLOAD_UNSAFE;

  useEffect(() => {
    document.title = applicationStore.appTitle;
  });

  useEffect(() => {
    if (!applicationStore.locationRestrictionEnabled) {
      console.debug('Skipping location restriction functionality in this app.');
      walletStore.checkConnectedWallet();
    } else {
      checkUserCountryRestriction().then((res: any) => {
        if (res.restricted) {
          walletStore.accountDataLoaded = true;
          applicationStore.userGeo = res.userGeo;
          applicationStore.strategyRedirect = config.routes.COUNTRY_NOT_SUPPORTED;
          navigate(config.routes.COUNTRY_NOT_SUPPORTED);
        } else {
          walletStore.checkConnectedWallet();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (walletStore?.accountDataLoaded && !unsafeMode) {
      navigate(applicationStore.strategyRedirect);
    }
  }, [walletStore?.accountDataLoaded]);

  useEffect(() => {
    setTheme({ colors: getColors({ isDarkTheme: applicationStore.darkMode }) });
  }, [applicationStore.darkMode]);

  return (
      <StyledEngineProvider injectFirst>
        <DeveloperHelper />
        <ThemeProvider theme={applicationStore.theme}>
          <ThemeProviderLegacy theme={applicationStore.theme}>
            <ScThemeProvider theme={theme}>
              <GlobalStyle/>
              {!walletStore?.accountDataLoaded && (
                  <LoaderWrapper>
                    <Loader src={ssvLoader} />
                  </LoaderWrapper>
              )}
              <BarMessage/>
              <BrowserView>
                {walletStore?.accountDataLoaded && <Routes/>}
              </BrowserView>
            <MobileView>
                <MobileNotSupported/>
              </MobileView>
              <CssBaseline/>
            </ScThemeProvider>
          </ThemeProviderLegacy>
        </ThemeProvider>
      </StyledEngineProvider>
  );
};

export default observer(App);
