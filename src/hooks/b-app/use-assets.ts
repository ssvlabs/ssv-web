import { getBAppsAssets } from "@/api/b-app";
import { createDefaultPagination } from "@/lib/utils/api";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { usePaginationQuery } from "@/lib/query-states/use-pagination";
import { erc20verificationTokenAddress } from "@/lib/utils/token.ts";
import { chunk } from "lodash-es";

export const useBAppsAssets = () => {
  const paginationQuery = usePaginationQuery();

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

  const verifiedAssets = assets.filter(
    ({ token }) => (erc20Verification.data || {})[token],
  );
  console.log("verifiedAssets:", verifiedAssets);

  const paginatedAssets = chunk(verifiedAssets, paginationQuery.perPage);
  console.log("paginatedAssets:", paginatedAssets);

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
