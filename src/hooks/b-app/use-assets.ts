import { getBAppsAssets } from "@/api/b-app";
import { createDefaultPagination } from "@/lib/utils/api";
import { queryOptions } from "@tanstack/react-query";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { UseQueryOptions } from "@/lib/react-query";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { usePaginationQuery } from "@/lib/query-states/use-pagination";

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

  return {
    query,
    assets,
    pagination,
    hasNext,
    hasPrev,
    next: paginationQuery.next,
    prev: paginationQuery.prev,
    page: paginationQuery.page,
  };
};
