import type { BApp, BAppsMetaData } from "@/api/b-app.ts";
import { getBAppByID } from "@/api/b-app.ts";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { Address } from "abitype";
import { useBAppMetadata } from "@/hooks/b-app/use-b-app-metadata.ts";

import { erc20verificationTokenAddress } from "@/lib/utils/token.ts";

export const useBApp = (bAppId?: Address) => {
  const bAppQuery = useChainedQuery({
    queryKey: ["get_bApp", bAppId],
    queryFn: () => getBAppByID({ id: bAppId }),
    enabled: !!bAppId,
  });
  const bApp = bAppQuery.data;
  const { data: bAppMetadata, isLoading: bAppMetadataIsLoading } =
    useBAppMetadata([{ id: bApp?.id || "", url: bApp?.metadataURI || "" }]);

  const erc20Verification = useChainedQuery({
    queryKey: ["erc20Verification", bApp?.supportedAssets],
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const results: Record<`0x${string}`, boolean> = {};
      await Promise.all(
        bApp!.supportedAssets.map(async (token) => {
          results[token] = await erc20verificationTokenAddress(token);
        }),
      );
      return results;
    },
    enabled: (bApp?.supportedAssets || []).length > 0,
  });

  return {
    bApp: {
      ...bApp,
      ...bAppMetadata[`${bApp?.id}`],
      supportedAssets: (bApp?.supportedAssets || []).filter(
        (token) => (erc20Verification.data || {})[token],
      ),
      delegatedSlashable: (bApp?.delegatedSlashable || []).filter(
        (asset) => (erc20Verification.data || {})[asset.token],
      ),
    } as BApp & BAppsMetaData,
    isLoading: bAppQuery.isLoading,
    bAppMetadataIsLoading,
  };
};
