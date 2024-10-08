import type { DisclaimerComponent } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider as OriginalRainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import type { FC } from "react";
import React from "react";
import { rainbowKitTheme } from "./themes";
import { useTheme } from "@/hooks/app/use-theme";

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
  const theme = useTheme();
  return (
    <OriginalRainbowKitProvider
      modalSize="compact"
      appInfo={{
        appName: "RainbowKit Demo",
        disclaimer: Disclaimer,
      }}
      theme={theme.dark ? rainbowKitTheme.dark : rainbowKitTheme.light}
    >
      {children}
    </OriginalRainbowKitProvider>
  );
};
