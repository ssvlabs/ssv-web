import { useChainedQuery } from "@/hooks/react-query/use-chained-query.ts";
import type { StrategyMetadata } from "@/api/b-app.ts";
import { getStrategiesMetadata } from "@/api/b-app.ts";

export const useStrategyMetadata = (
  data: { id: string; url: string }[],
): { data: Record<string, StrategyMetadata>; isLoading: boolean } => {
  const strategyMetadata = useChainedQuery({
    queryKey: ["strategy_metadata", data],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getStrategiesMetadata(data),
    enabled: Boolean(data.length),
  });

  const { data: dataItem, isLoading } = strategyMetadata;

  return {
    data: (dataItem || []).reduce((acc, metadataItem) => {
      return { ...acc, [metadataItem.id]: metadataItem.data };
    }, {}),
    isLoading,
  };
};
