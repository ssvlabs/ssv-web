import {
  DisclaimerComponent,
  RainbowKitProvider as OriginalRainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import React, { FC } from "react";
import { rainbowKitTheme } from "./themes";

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="https://ssv.network/terms-of-use/">Terms & Conditions</Link> and{" "}
    <Link href="https://ssv.network/privacy-policy/">Privacy Policy</Link>
  </Text>
);

export const RainbowKitProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <OriginalRainbowKitProvider
      modalSize="compact"
      appInfo={{
        appName: "RainbowKit Demo",
        disclaimer: Disclaimer,
      }}
      theme={
        !children?.toString() ? rainbowKitTheme.dark : rainbowKitTheme.light
      }
    >
      {children}
    </OriginalRainbowKitProvider>
  );
};
