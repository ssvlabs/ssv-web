import { RainbowKitProvider as OriginalRainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import React, { FC } from 'react';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode } from '~app/redux/appState.slice';

export const RainbowKitProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useAppSelector(getIsDarkMode);
  return <OriginalRainbowKitProvider theme={isDarkMode ? darkTheme() : undefined}>{children}</OriginalRainbowKitProvider>;
};
