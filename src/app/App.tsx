import { configure } from 'mobx';
import React, { useEffect, useState, useMemo } from 'react';
import styled, { ThemeProvider as ScThemeProvider } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { OnboardAPI } from '@web3-onboard/core';
import { Web3OnboardProvider, init } from '@web3-onboard/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';
import { ThemeProvider as ThemeProviderLegacy } from '@mui/styles';
import Routes from '~app/Routes/Routes';
import config from '~app/common/config';
import { getColors } from '~root/themes';
import { GlobalStyle } from '~app/globalStyle';
import BarMessage from '~app/components/common/BarMessage';
import { checkUserCountryRestriction } from '~lib/utils/compliance';
import MobileNotSupported from '~app/components/common/MobileNotSupported';
import { initOnboardOptions } from '~root/providers/onboardSettings.provider';
import { useAppSelector } from '~app/hooks/redux.hook';
import {
  getIsDarkMode,
  getIsShowSsvLoader, getRestrictedUserGeo,
  getShouldCheckCountryRestriction,
  setRestrictedUserGeo,
} from '~app/redux/appState.slice';
import { AppTheme } from '~root/Theme';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { useDispatch } from 'react-redux';
import { getStrategyRedirect } from '~app/redux/navigation.slice';

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

const Loader = styled.img`
  width: 200px;
`;

const onboardInstance = init(initOnboardOptions);

configure({ enforceActions: 'never' });

document.title = 'SSV Network';
if (process.env.REACT_APP_FAUCET_PAGE) {
  document.title = 'SSV Network Faucet';
} if (process.env.REACT_APP_CLAIM_PAGE) {
  document.title = 'SSV Network Distribution';
}

const App = () => {
  const dispatch = useDispatch();
  const isDarkMode = useAppSelector(getIsDarkMode);
  const strategyRedirect = useAppSelector(getStrategyRedirect);
  const isShowSsvLoader = useAppSelector(getIsShowSsvLoader);
  const shouldCheckCountryRestriction = useAppSelector(getShouldCheckCountryRestriction);
  const [theme, setTheme] = useState<{ colors: any }>({ colors: getColors({ isDarkMode }) });
  const [web3Onboard, setWeb3Onboard] = useState<OnboardAPI | null>(null);
  const isRestrictedCountry = useAppSelector(getRestrictedUserGeo);
  const navigate = useNavigate();

  useEffect(() => {
    setWeb3Onboard(onboardInstance);
  }, []);

  useEffect(() => {
    setTheme({ colors: getColors({ isDarkMode }) });
    web3Onboard?.state.actions.updateTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (getFromLocalStorageByKey('locationRestrictionDisabled')) {
      console.debug('Skipping location restriction functionality in this app.');
      dispatch(setRestrictedUserGeo(''));
    } else if (shouldCheckCountryRestriction) {
      checkUserCountryRestriction().then((res: any) => {
        if (!!res) {
          dispatch(setRestrictedUserGeo(res));
          navigate(config.routes.COUNTRY_NOT_SUPPORTED);
        } else {
          dispatch(setRestrictedUserGeo(''));
          navigate(config.routes.SSV.ROOT);
        }
      });
    } else {
      dispatch(setRestrictedUserGeo(''));
      navigate(config.routes.SSV.ROOT);
    }
  }, [shouldCheckCountryRestriction]);

  useEffect(() => {
    if (!isRestrictedCountry) {
      navigate(strategyRedirect);
    }
  }, [strategyRedirect]);

  const MuiTheme = useMemo(() => createTheme(AppTheme({ isDarkMode })), [isDarkMode]);

  return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={MuiTheme}>
          <ThemeProviderLegacy theme={MuiTheme}>
            <ScThemeProvider theme={theme}>
              <GlobalStyle/>
              {isShowSsvLoader && (<LoaderWrapper><Loader src={'/images/ssv-loader.svg'} /></LoaderWrapper>)}
              <BarMessage/>
              <BrowserView>
                {web3Onboard && <Web3OnboardProvider web3Onboard={web3Onboard}><Routes/></Web3OnboardProvider>}
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

export default App;
