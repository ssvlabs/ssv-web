import type { StrategyMetadata } from "@/api/b-app.ts";
import { getStrategiesMetadata } from "@/api/b-app.ts";
import { chainedQueryOptions } from "@/hooks/react-query/chained-query-options";
import { queryClient } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { useMutation, useQuery } from "@tanstack/react-query";

type URLS = { id: string; url: string }[];

const createMap = (data: Awaited<ReturnType<typeof getStrategiesMetadata>>) =>
  data.reduce(
    (acc, metadata) => ({ ...acc, [metadata.id]: metadata.data }),
    {} as Record<string, StrategyMetadata>,
  );

export const getStrategiesMetadataQueryOptions = (urls: URLS) =>
  chainedQueryOptions({
    queryKey: ["strategy_metadata", urls],
    staleTime: ms(30, "seconds"),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getStrategiesMetadata(urls),
    select: (data) => ({ list: data, map: createMap(data) }),
    enabled: Boolean(urls.length),
  });

export const queryFetchStrategiesMetadata = async (urls: URLS) => {
  return queryClient.fetchQuery(getStrategiesMetadataQueryOptions(urls));
};
export const useStrategiesMetadata = (urls: URLS) => {
  return useQuery(getStrategiesMetadataQueryOptions(urls));
};

export const useFetchStrategiesMetadata = () => {
  return useMutation({
    mutationFn: (urls: URLS) =>
      queryFetchStrategiesMetadata(urls).then((list) => ({
        list,
        map: createMap(list),
      })),
  });
};
