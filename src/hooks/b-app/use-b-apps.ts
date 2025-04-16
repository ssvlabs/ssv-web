import type { BApp } from "@/api/b-app.ts";
import { getBApps } from "@/api/b-app.ts";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import { useSearchParams } from "react-router-dom";
import { createDefaultPagination } from "@/lib/utils/api.ts";
import { getTokenMetadata } from "@/lib/utils/tokens-helper.ts";
import { usePaginationQuery } from "@/lib/query-states/use-pagination.ts";
import { useBAppMetadata } from "@/hooks/b-app/use-b-app-metadata.ts";
import { erc20verificationTokenAddress } from "@/lib/utils/token.ts";

export const useBApps = () => {
  const [searchParams] = useSearchParams();
  const { page, perPage } = usePaginationQuery();

  const id = searchParams.get("id") || "";

  const query = useChainedQuery({
    queryKey: ["get_bApps", page, perPage, id],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getBApps({ id, page, perPage }),
  });

  const bApps = query.data?.data || [];

  const { data: bAppsMetadata, isLoading: bAppsMetadataIsLoading } =
    useBAppMetadata(
      bApps.map(({ id, metadataURI }) => ({
        id,
        url: metadataURI || "",
      })) || [],
    );

  const isBAppsLoading = query.isLoading || bAppsMetadataIsLoading;

  const assetsQuery = useChainedQuery({
    queryKey: ["get_assets_data", bApps],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getTokenMetadata(bApps.map((bApp: BApp) => bApp.supportedAssets)),
    enabled: true,
  });

  const erc20Verification = useChainedQuery({
    queryKey: ["erc20Verification", bApps],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const results: Record<`0x${string}`, boolean> = {};
      await Promise.all(
        bApps.map(async ({ supportedAssets }) =>
          supportedAssets.map(async (token) => {
            if (Object.keys(results).includes(token)) {
              return;
            }
            results[token] = await erc20verificationTokenAddress(token);
          }),
        ),
      );
      return results;
    },
    enabled: (bApps || []).length > 0,
  });

  const assetsData =
    assetsQuery.data ||
    ({} as Record<string, { symbol: string; name: string }>);

  const pagination = query.data?.pagination || createDefaultPagination();
  return {
    query,
    bApps: bApps.map((bApp) => ({
      ...bApp,
      ...bAppsMetadata[bApp.id],
      supportedAssets: bApp.supportedAssets.filter(
        (token) => (erc20Verification.data || {})[token],
      ),
    })),
    pagination,
    assetsData,
    isBAppsLoading,
  };
};
