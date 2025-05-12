import { useChainedQuery } from "@/hooks/react-query/use-chained-query.ts";
import type { StrategyMetadata } from "@/api/b-app.ts";
import { getStrategiesMetadata } from "@/api/b-app.ts";
import { chainedQueryOptions } from "@/hooks/react-query/chained-query-options";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";

type URLS = { id: string; url: string }[];

const createMap = (data: Awaited<ReturnType<typeof getStrategiesMetadata>>) =>
  data.reduce(
    (acc, metadata) => ({ ...acc, [metadata.id]: metadata.data }),
    {} as Record<string, StrategyMetadata>,
  );

export const getStrategiesMetadataQueryOptions = (urls: URLS) =>
  chainedQueryOptions({
    queryKey: ["strategy_metadata", urls],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getStrategiesMetadata(urls),
    select: (data) => createMap(data),
    enabled: Boolean(urls.length),
  });

export const queryFetchStrategiesMetadata = async (urls: URLS) => {
  return queryClient.fetchQuery(getStrategiesMetadataQueryOptions(urls));
};
export const useStrategiesMetadata = (urls: URLS) => {
  return useChainedQuery(getStrategiesMetadataQueryOptions(urls));
};

export const useFetchStrategiesMetadata = () => {
  return useMutation({
    mutationFn: (urls: URLS) => getStrategiesMetadata(urls).then(createMap),
  });
};
