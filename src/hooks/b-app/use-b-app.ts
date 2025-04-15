import type { BApp, BAppsMetaData } from "@/api/b-app.ts";
import { getBAppByID } from "@/api/b-app.ts";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";
import type { Address } from "abitype";
import { useBAppMetadata } from "@/hooks/b-app/use-b-app-metadata.ts";

export const useBApp = (bAppId?: Address) => {
  const bAppQuery = useChainedQuery({
    queryKey: ["get_bApp", bAppId],
    queryFn: () => getBAppByID({ id: bAppId }),
    enabled: !!bAppId,
  });
  const bApp = bAppQuery.data;
  const { data: bAppMetadata, isLoading: bAppMetadataIsLoading } =
    useBAppMetadata([{ id: bApp?.id || "", url: bApp?.metadataURI || "" }]);

  return {
    bApp: { ...bApp, ...bAppMetadata[`${bApp?.id}`] } as BApp & BAppsMetaData,
    isLoading: bAppQuery.isLoading,
    bAppMetadataIsLoading,
  };
};
