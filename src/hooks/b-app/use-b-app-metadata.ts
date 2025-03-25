import { useChainedQuery } from "@/hooks/react-query/use-chained-query.ts";
import type { BAppsMetaData } from "@/api/b-app.ts";
import { getBAppsMetadata } from "@/api/b-app.ts";

export const useBAppMetadata = (
  data: { id: string; url: string }[],
): { data: Record<string, BAppsMetaData>; isLoading: boolean } => {
  const bAppMetadata = useChainedQuery({
    queryKey: ["b_app_metadata", data],
    queryFn: () => getBAppsMetadata(data),
    enabled: Boolean(data.length),
  });

  const { data: dataItem, isLoading } = bAppMetadata;

  return {
    data: (dataItem || []).reduce((acc, metadataItem) => {
      return { ...acc, [metadataItem.id]: metadataItem.data };
    }, {}),
    isLoading,
  };
};
