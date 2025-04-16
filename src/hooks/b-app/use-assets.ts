import { getBAppsAssets } from "@/api/b-app";
import { createDefaultPagination } from "@/lib/utils/api";
import { queryOptions } from "@tanstack/react-query";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { usePaginationQuery } from "@/lib/query-states/use-pagination";
import { erc20verificationTokenAddress } from "@/lib/utils/token.ts";

export const getBAppsAssetsQueryOptions = (
  page: number = 1,
  perPage: number = 10,
  { options } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    queryKey: ["bapp-assets", page, perPage],
    queryFn: () =>
      getBAppsAssets({
        page,
        perPage,
      }),
    enabled: enabled(options?.enabled),
  });
};

export const useBAppsAssets = (perPage = 10, options: UseQueryOptions = {}) => {
  const paginationQuery = usePaginationQuery({
    page: 1,
    perPage: perPage,
  });

  const query = useChainedQuery(
    getBAppsAssetsQueryOptions(paginationQuery.page, paginationQuery.perPage, {
      options,
    }),
  );

  const pagination = createDefaultPagination();
  const hasNext = paginationQuery.page < pagination.pages;
  const hasPrev = paginationQuery.page > 1;

  const assets = query.data || [];

  const erc20Verification = useChainedQuery({
    queryKey: ["erc20Verification", query.data],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const results: Record<`0x${string}`, boolean> = {};
      await Promise.all(
        assets.map(async ({ token }) => {
          results[token] = await erc20verificationTokenAddress(token);
        }),
      );
      return results;
    },
    enabled: (query.data || []).length > 0,
  });

  return {
    query,
    assets: assets.filter(({ token }) => (erc20Verification.data || {})[token]),
    pagination,
    hasNext,
    hasPrev,
    next: paginationQuery.next,
    prev: paginationQuery.prev,
    page: paginationQuery.page,
  };
};
