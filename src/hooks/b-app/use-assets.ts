import type { BAppAsset } from "@/api/b-app";
import { getBAppsAssets } from "@/api/b-app";
import { createDefaultPagination } from "@/lib/utils/api";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { usePaginationQuery } from "@/lib/query-states/use-pagination";
import { erc20verificationTokenAddress } from "@/lib/utils/token.ts";
import { chunk } from "lodash-es";
import { useQueryState } from "nuqs";
import { getSortingStateParser } from "@/lib/utils/parsers";

export const useBAppsAssets = () => {
  const paginationQuery = usePaginationQuery();

  const [sorting] = useQueryState(
    "ordering",
    getSortingStateParser<BAppAsset>().withOptions({
      clearOnDefault: true,
      shallow: false,
    }),
  );

  const query = useChainedQuery({
    queryKey: ["bapp-assets"],
    queryFn: () => getBAppsAssets(),
  });

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

  const verifiedAssets = assets
    .filter(({ token }) => (erc20Verification.data || {})[token])
    .sort((a, b) => {
      const sort = sorting?.[0];
      if (!sort) return 0;
      switch (sort.id) {
        case "totalDelegated": {
          const [aValue, bValue] = sort.desc
            ? [Number(b.totalDelegated), Number(a.totalDelegated)]
            : [Number(a.totalDelegated), Number(b.totalDelegated)];
          return aValue - bValue;
        }
        case "delegatedStrategies": {
          const [aValue, bValue] = sort.desc
            ? [Number(b.delegatedStrategies), Number(a.delegatedStrategies)]
            : [Number(a.delegatedStrategies), Number(b.delegatedStrategies)];
          return aValue - bValue;
        }
        default:
          return 0;
      }
    });

  const paginatedAssets = chunk(verifiedAssets, paginationQuery.perPage);

  const pagination = createDefaultPagination({
    pages: paginatedAssets.length,
    page: paginationQuery.page,
    has_next_page: paginationQuery.page < paginatedAssets.length,
    per_page: paginationQuery.perPage,
    total: verifiedAssets.length,
  });

  const selectedAssetsChunk = paginatedAssets[paginationQuery.page - 1] || [];

  return {
    query,
    assets: selectedAssetsChunk,
    pagination,
    hasNext: pagination.has_next_page,
    hasPrev: pagination.page > 1,
    next: paginationQuery.next,
    prev: paginationQuery.prev,
    page: paginationQuery.page,
  };
};
