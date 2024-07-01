import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as ThemeProviderLegacy } from '@mui/styles';
import { configure } from 'mobx';
import { useEffect, useMemo } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider as ScThemeProvider } from 'styled-components';
import Routes from '~app/Routes/Routes';
import config from '~app/common/config';
import BarMessage from '~app/components/common/BarMessage';
import MobileNotSupported from '~app/components/common/MobileNotSupported';
import { GlobalStyle } from '~app/globalStyle';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useNavigateToRoot } from '~app/hooks/useNavigateToRoot';
import { useWalletConnectivity } from '~app/hooks/useWalletConnectivity';
import { getIsDarkMode, getIsShowSsvLoader, getRestrictedUserGeo, setRestrictedUserGeo } from '~app/redux/appState.slice';
import { getStrategyRedirect } from '~app/redux/navigation.slice';
import { getAccountAddress, getIsMainnet } from '~app/redux/wallet.slice.ts';
import { checkUserCountryRestriction } from '~lib/utils/compliance';
import { AppTheme } from '~root/Theme';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { getColors } from '~root/themes';
import './globals.css';

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
  background-color: ${({ theme }) => theme.colors.loaderColor};
`;

const Loader = styled.img<{ src: string }>`
  width: 200px;
`;

configure({ enforceActions: 'never' });

document.title = 'SSV Network';
if (import.meta.env.VITE_FAUCET_PAGE) {
  document.title = 'SSV Network Faucet';
}
if (import.meta.env.VITE_CLAIM_PAGE) {
  document.title = 'SSV Network Distribution';
}

const App = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(getIsDarkMode);
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const isShowSsvLoader = useAppSelector(getIsShowSsvLoader);
  const theme = { colors: getColors({ isDarkMode }) };
  const isRestrictedCountry = useAppSelector(getRestrictedUserGeo);
  const navigate = useNavigate();
  const isMainnet = useAppSelector(getIsMainnet);
  const accountAddress = useAppSelector(getAccountAddress);
  const { navigateToRoot } = useNavigateToRoot();

  useWalletConnectivity();

  useEffect(() => {
    if (import.meta.env.VITE_FAUCET_PAGE) return;
    if (getFromLocalStorageByKey('locationRestrictionDisabled')) {
      console.debug('Skipping location restriction functionality in this app.');
      dispatch(setRestrictedUserGeo(''));
    } else if (isMainnet) {
      checkUserCountryRestriction().then((res: any) => {
        if (!!res) {
          dispatch(setRestrictedUserGeo(res));
          navigate(config.routes.COUNTRY_NOT_SUPPORTED);
        } else {
          dispatch(setRestrictedUserGeo(''));
          navigateToRoot();
        }
      });
    } else {
      dispatch(setRestrictedUserGeo(''));
      navigateToRoot();
    }
  }, [isMainnet, accountAddress, navigateToRoot, dispatch]);

  useEffect(() => {
    if (!isRestrictedCountry) {
      navigate(strategyRedirect);
    }
  }, [strategyRedirect]);

  const MuiTheme = useMemo(() => createTheme(AppTheme({ isDarkMode })), [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={MuiTheme}>
        <ThemeProviderLegacy theme={MuiTheme}>
          {/* @ts-ignore */}
          <ScThemeProvider theme={theme}>
            <div
              style={{
                color: theme.colors.black
              }}
            >
              {/* @ts-ignore */}
              <GlobalStyle />
              {isShowSsvLoader && (
                <LoaderWrapper>
                  <Loader src={'/images/ssv-loader.svg'} />
                </LoaderWrapper>
              )}
              <BarMessage />
              <BrowserView>
                <Routes />
              </BrowserView>
              <MobileView>
                <MobileNotSupported />
              </MobileView>
              <CssBaseline />
            </div>
          </ScThemeProvider>
        </ThemeProviderLegacy>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
