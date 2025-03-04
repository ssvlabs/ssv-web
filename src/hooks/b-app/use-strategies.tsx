import { getStrategies } from "@/api/b-app.ts";
import { useStrategiesFilters } from "@/hooks/b-app/filters/use-strategies-filters";
import { useOrdering } from "@/hooks/use-ordering.ts";
import { createDefaultPagination } from "@/lib/utils/api.ts";
import { getTokenMetadata } from "@/lib/utils/tokens-helper.ts";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { useParams } from "react-router";

export const useStrategies = (_strategyId?: string) => {
  const params = useParams();
  const strategyId = _strategyId || params.strategyId;
  const filters = useStrategiesFilters();
  const { orderBy, sort, ordering } = useOrdering();

  const query = useChainedQuery({
    queryKey: [
      "get_strategies",
      filters.paginationQuery.page,
      filters.paginationQuery.perPage,
      filters.tokensFilter.value,
      filters.idFilter.value,
      orderBy,
      sort,
    ],
    queryFn: () => {
      return getStrategies({
        id: filters.idFilter.value,
        page: filters.paginationQuery.page,
        perPage: filters.paginationQuery.perPage,
        token: filters.tokensFilter.value,
        ordering,
      });
    },
    enabled: true,
  });

  const isStrategiesLoading = query.isLoading;
  const strategies = query.data?.data || [];
  const assetsQuery = useChainedQuery({
    queryKey: ["get_assets_data", strategies],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getTokenMetadata(strategies.map((strategy) => strategy.delegatedAssets)),
    enabled: true,
  });

  const assetsData =
    assetsQuery.data ||
    ({} as Record<string, { symbol: string; name: string }>);
  const strategy = strategies.filter(
    (strategy) => strategy.id === strategyId,
  )[0];
  const pagination = query.data?.pagination || createDefaultPagination();
  return {
    query,
    pagination,
    strategies,
    assetsData,
    strategy,
    strategyId,
    isStrategiesLoading,
    orderBy,
    sort,
  };
};
