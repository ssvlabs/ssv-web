import { queryOptions, useQuery } from "@tanstack/react-query";

import type { UseQueryOptions } from "@/lib/react-query";
import { enabled, getDefaultChainedQueryOptions } from "@/lib/react-query";
import { getCluster } from "@/api/cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useChainId } from "wagmi";
import { boolify } from "@/lib/utils/boolean";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const getClusterQueryOptions = (
  hash?: string,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    queryKey: ["cluster", hash?.toLowerCase(), chainId],
    queryFn: () => getCluster(hash!),
    enabled: boolify(hash) && enabled(options?.enabled),
  });
};

export const useCluster = (hash?: string, options?: UseQueryOptions) => {
  const { clusterHash } = useClusterPageParams();
  const chainId = useChainId();

  return useQuery(
    getClusterQueryOptions(hash ?? clusterHash, {
      chainId,
      options,
    }),
  );
};
