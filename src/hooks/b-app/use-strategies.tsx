import { useQuery } from "@tanstack/react-query";
import { getStrategies } from "@/api/b-app.ts";
import { useSearchParams } from "react-router-dom";
import { createDefaultPagination } from "@/lib/utils/api.ts";
import { getTokenMetadata } from "@/lib/utils/tokens-helper.ts";
import { useParams } from "react-router";

export const useStrategies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { strategyId } = useParams();
  setSearchParams;
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 10);
  const query = useQuery({
    queryKey: ["get_strategies", page, perPage],
    queryFn: () => {
      return getStrategies({ page: page, perPage: perPage });
    },
    enabled: true,
  });

  const strategies = query.data?.data || [];
  const assetsQuery = useQuery({
    queryKey: ["get_assets_data", strategies],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getTokenMetadata(strategies.map((strategy) => strategy.assets)),
    enabled: true,
  });

  console.log(strategies);
  const assetsData =
    assetsQuery.data ||
    ({} as Record<string, { symbol: string; name: string }>);
  const strategy = strategies.filter(
    (strategy) => strategy.id === strategyId,
  )[0];
  const pagination = query.data?.pagination || createDefaultPagination();
  return { query, pagination, strategies, assetsData, strategy, strategyId };
};
