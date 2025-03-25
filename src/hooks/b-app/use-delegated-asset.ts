import type { GetDelegatedAssetParams } from "@/api/b-app";
import { getDelegatedAsset } from "@/api/b-app";
import { queryClient } from "@/lib/react-query";
import { useChainedQuery } from "@/hooks/react-query/use-chained-query";

export const useDelegatedAsset = (params: Partial<GetDelegatedAssetParams>) => {
  const queryKey = ["delegated-asset", params];
  const query = useChainedQuery({
    queryKey,
    queryFn: () => getDelegatedAsset(params as GetDelegatedAssetParams),
    enabled: !!params.token && !!params.contributor && !!params.strategyId,
  });

  return {
    ...query,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  };
};
