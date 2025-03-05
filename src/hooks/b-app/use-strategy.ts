import { useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { Strategy } from "@/api/b-app.ts";
import { getMyAccount } from "@/api/b-app.ts";
import { getStrategyById } from "@/api/b-app.ts";

export const useStrategy = () => {
  const params = useParams();
  const strategyId = params.strategyId;
  const queryClient = useQueryClient();

  const strategy = useChainedQuery({
    queryKey: ["get_strategy_by_id", strategyId],
    queryFn: () => getStrategyById(strategyId || 0),
    enabled: Boolean(strategyId),
  });

  const account = useChainedQuery({
    queryKey: ["Account", strategy.data?.ownerAddress],
    queryFn: () =>
      strategy.data?.ownerAddress && getMyAccount(strategy.data.ownerAddress),
    enabled: Boolean(strategy.data?.ownerAddress),
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["get_strategy_by_id", strategyId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["Account", strategy.data?.ownerAddress],
      }),
    ]);
  };

  return {
    account: account?.data?.data[0],
    isLoading: strategy.isLoading || account.isLoading,
    strategy: strategy.data || ({} as Strategy),
    invalidate,
  };
};
