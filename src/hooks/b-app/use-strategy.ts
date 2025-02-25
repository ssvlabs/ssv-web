import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Strategy } from "@/api/b-app.ts";
import { getMyAccount } from "@/api/b-app.ts";
import { getStrategyById } from "@/api/b-app.ts";

export const useStrategy = () => {
  const params = useParams();
  const strategyId = params.strategyId;
  const strategy = useQuery({
    queryKey: ["get_strategy_by_id", strategyId],
    queryFn: () => getStrategyById(strategyId || 0),
    enabled: Boolean(strategyId),
  });

  const account = useQuery({
    queryKey: ["Account", strategy.data?.ownerAddress],
    queryFn: () =>
      strategy.data?.ownerAddress && getMyAccount(strategy.data.ownerAddress),
    enabled: Boolean(strategy.data?.ownerAddress),
  });

  return {
    account: account?.data?.data[0],
    isLoading: strategy.isLoading || account.isLoading,
    strategy: strategy.data || ({} as Strategy),
  };
};
