import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Strategy } from "@/api/b-app.ts";
import { getStrategyById } from "@/api/b-app.ts";

export const useStrategy = () => {
  const params = useParams();
  const strategyId = params.strategyId;
  const strategy = useQuery({
    queryKey: ["get_strategy_by_id", strategyId],
    queryFn: () => getStrategyById(strategyId || 0),
    enabled: Boolean(strategyId),
  });

  return {
    isLoading: strategy.isLoading,
    strategy: strategy.data || ({} as Strategy),
  };
};
