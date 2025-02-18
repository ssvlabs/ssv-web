import { getBAppsAssets } from "@/api/b-app";
import { useQuery } from "@tanstack/react-query";

export const useBAppsAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: getBAppsAssets,
  });
};
