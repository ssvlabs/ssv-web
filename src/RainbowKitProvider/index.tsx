import { DisclaimerComponent, RainbowKitProvider as OriginalRainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import React, { FC } from 'react';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { rainbowKitTheme } from '~root/RainbowKitProvider/themes';

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the <Link href="https://ssv.network/terms-of-use/">Terms & Conditions</Link> and{' '}
    <Link href="https://ssv.network/privacy-policy/">Privacy Policy</Link>
  </Text>
);

export const RainbowKitProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useAppSelector(getIsDarkMode);
  return (
    <OriginalRainbowKitProvider
      modalSize="compact"
      appInfo={{
        appName: 'RainbowKit Demo',
        disclaimer: Disclaimer
      }}
      theme={isDarkMode ? rainbowKitTheme.dark : rainbowKitTheme.light}
    >
      {children}
    </OriginalRainbowKitProvider>
  );
};
