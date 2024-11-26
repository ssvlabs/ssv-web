import { useAccountState } from "@/hooks/account/use-account-state";
import { mixpanel } from "@/lib/analytics/mixpanel";
import { useEffect, useRef } from "react";
import { useAccount, useAccountEffect } from "wagmi";

export const useIdentify = () => {
  // using useAccount from wagmi to track the real wallet address instead of the testWalletAddress
  const { address } = useAccount();
  const state = useAccountState();

  const hasSetMixpanelUserType = useRef(false);

  useAccountEffect({
    onDisconnect: () => {
      hasSetMixpanelUserType.current = false;
      mixpanel.reset();
    },
  });
  useEffect(() => {
    if (address) mixpanel.identify(address);
  }, [address]);

  useEffect(() => {
    const shouldIdentify =
      address &&
      !hasSetMixpanelUserType.current &&
      !state.isLoading &&
      !state.isNewAccount &&
      !state.isLoading &&
      "people" in mixpanel;

    if (shouldIdentify) {
      mixpanel.identify(address);
      mixpanel.people.set_once({
        user_type:
          state.hasClusters && state.hasOperators
            ? "Both"
            : state.hasClusters
              ? "Staker"
              : "Operator",
      });
      hasSetMixpanelUserType.current = true;
    }
  }, [
    address,
    state.hasClusters,
    state.hasOperators,
    state.isLoading,
    state.isNewAccount,
  ]);
};
