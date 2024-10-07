import { mixpanel } from "@/lib/mixpanel";
import { useEffect } from "react";
import { useAccount, useAccountEffect } from "wagmi";

export const useIdentify = () => {
  // using useAccount from wagmi to track the real wallet address instead of the testWalletAddress
  const { address } = useAccount();
  useAccountEffect({
    onDisconnect: () => mixpanel.reset(),
  });
  useEffect(() => {
    if (address) mixpanel.identify(address);
  }, [address]);
};
