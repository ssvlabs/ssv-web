import { useChainedQuery } from "@/hooks/react-query/use-chained-query.ts";
import type { AccountMetadata } from "@/api/b-app.ts";
import { getAccountsMetadata } from "@/api/b-app.ts";
import { chainedQueryOptions } from "@/hooks/react-query/chained-query-options";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { ms } from "@/lib/utils/number";

type AccountURLs = { id: string; url: string }[];

const createMap = (data: Awaited<ReturnType<typeof getAccountsMetadata>>) =>
  data.reduce(
    (acc, metadata) => ({ ...acc, [metadata.id]: metadata.data }),
    {} as Record<string, AccountMetadata>,
  );

export const getAccountsMetadataQueryOptions = (data: AccountURLs) =>
  chainedQueryOptions({
    queryKey: ["account_metadata", data],
    staleTime: ms(30, "seconds"),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getAccountsMetadata(data),
    select: (list) => ({ list, map: createMap(list) }),
    enabled: Boolean(data.length),
  });

export const queryFetchAccountsMetadata = async (data: AccountURLs) => {
  return queryClient.fetchQuery(getAccountsMetadataQueryOptions(data));
};

export const useAccountsMetadata = (data: AccountURLs) => {
  return useChainedQuery(getAccountsMetadataQueryOptions(data));
};

export const useFetchAccountsMetadata = () => {
  return useMutation({
    mutationFn: (data: AccountURLs) =>
      queryFetchAccountsMetadata(data).then((list) => ({
        list,
        map: createMap(list),
      })),
  });
};
