import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { MyBAppAccount, Strategy } from "@/api/b-app.ts";
import { getMyAccount, getStrategyById } from "@/api/b-app.ts";
import { isAddress } from "viem";
// import { convertToPercentage } from "@/lib/utils/number.ts";

export const useStrategy = () => {
  const params = useParams();
  const strategyId = params.strategyId;

  const strategy = useQuery({
    queryKey: ["get_strategy_by_id", strategyId],
    queryFn: () => getStrategyById(strategyId || 0),
    enabled: Boolean(strategyId),
  });

  const account = useQuery({
    queryKey: [strategy.data?.ownerAddress],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getMyAccount(strategy.data?.ownerAddress || "0x"),
    enabled:
      Boolean(strategy.data?.ownerAddress) &&
      isAddress(strategy.data?.ownerAddress || "0x"),
  });

  // const totalPercentage = account?.data?.delegations.reduce(
  //   (
  //     acc: number,
  //     delegation: { percentage: string; receiver: { id: string } },
  //   ) => {
  //     const formattedPercentage = convertToPercentage(delegation.percentage);
  //     return Math.round((acc + Number(formattedPercentage)) * 100) / 100;
  //   },
  //   0,
  // );

  // const totalAccountDelegatedValue = Math.round(
  //   ((totalPercentage || 0) / 100) *
  //     Number(account?.data?.effectiveBalance || 0n),
  // );

  return {
    account: account.data || ({} as MyBAppAccount),
    strategy: strategy.data || ({} as Strategy),
    // totalAccountDelegatedValue,
  };
};
