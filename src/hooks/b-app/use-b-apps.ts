import type { BApp } from "@/api/b-app.ts";
import { getBApps } from "@/api/b-app.ts";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { createDefaultPagination } from "@/lib/utils/api.ts";
import { getTokenMetadata } from "@/lib/utils/tokens-helper.ts";

export const useBApps = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  setSearchParams;
  const page = Number(searchParams.get("page") || 1);
  const id = searchParams.get("id") || "";
  const perPage = Number(searchParams.get("perPage") || 10);

  const query = useQuery({
    queryKey: ["get_bApps", page, perPage, id],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => getBApps({ id, page, perPage }),
  });

  const bApps = query.data?.data || [];
  const isBAppsLoading = query.isLoading;
  const assetsQuery = useQuery({
    queryKey: ["get_assets_data", bApps],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () =>
      getTokenMetadata(bApps.map((bApp: BApp) => bApp.supportedAssets)),
    enabled: true,
  });
  const assetsData =
    assetsQuery.data ||
    ({} as Record<string, { symbol: string; name: string }>);
  const pagination = query.data?.pagination || createDefaultPagination();

  return { query, bApps, pagination, assetsData, isBAppsLoading };
};
