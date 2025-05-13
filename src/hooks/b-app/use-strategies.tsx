import type {
  AccountMetadata,
  Strategy,
  StrategyMetadata,
} from "@/api/b-app.ts";
import { getStrategies } from "@/api/b-app.ts";
import { useStrategiesFilters } from "@/hooks/b-app/filters/use-strategies-filters";
import { useOrdering } from "@/hooks/use-ordering.ts";
import { createDefaultPagination } from "@/lib/utils/api.ts";
import { getTokenMetadata } from "@/lib/utils/tokens-helper.ts";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { useParams } from "react-router";
import { useStrategiesMetadata } from "@/hooks/b-app/use-strategy-metadata.ts";
import { useAccountsMetadata } from "@/hooks/b-app/use-account-metadata.ts";

export const useStrategies = (_strategyId?: string, _bAppId?: string) => {
  const params = useParams();
  const strategyId = _strategyId || params.strategyId;
  const bAppId = _bAppId || params.bAppId;
  const filters = useStrategiesFilters();
  const { orderBy, sort } = useOrdering();

  const query = useChainedQuery({
    queryKey: [
      "get_strategies",
      filters.paginationQuery.page,
      filters.paginationQuery.perPage,
      filters.tokensFilter.value,
      filters.idFilter.value,
      orderBy,
      sort,
      bAppId,
    ],
    queryFn: () => {
      const queryParams: Record<
        string,
        string | number | `0x${string}`[] | null
      > = {
        bappId: bAppId?.toString() || null,
        page: filters.paginationQuery.page,
        perPage: filters.paginationQuery.perPage,
        token: filters.tokensFilter.value,
      };

      if (filters.idFilter.value) {
        queryParams.id = filters.idFilter.value;
      }

      return getStrategies(queryParams);
    },
    enabled: true,
  });
  const isStrategiesLoading = query.isLoading;
  const strategies = query.data?.data || [];

  const { data: strategiesMetadata, isLoading: strategiesMetadataIsLoading } =
    useStrategiesMetadata(
      strategies.map(({ id, metadataURI }) => ({
        id,
        url: metadataURI || "",
      })) || [],
    );

  const accountsMetadata = useAccountsMetadata(
    strategies.map(({ ownerAddress, ownerAddressMetadataURI }) => ({
      id: ownerAddress,
      url: ownerAddressMetadataURI || "",
    })) || [],
  );

  const assetsQuery = useChainedQuery({
    queryKey: ["get_assets_data", strategies],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getTokenMetadata(strategies.map((strategy) => strategy.depositedAssets)),
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
    strategies: strategies.map((strategy) => ({
      description: "",
      ...strategy,
      ...strategiesMetadata?.map[strategy.id],
      ownerAddressMetadata: accountsMetadata.data?.map[strategy.ownerAddress],
    })) satisfies (Strategy &
      StrategyMetadata & {
        ownerAddressMetadata?: AccountMetadata;
      })[],
    assetsData,
    strategy,
    strategyId,
    isStrategiesLoading:
      strategiesMetadataIsLoading ||
      isStrategiesLoading ||
      accountsMetadata.isLoading,
    orderBy,
    sort,
  };
};
