import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

import type { UseQueryOptions } from "@/lib/react-query";
import { enabled, getDefaultChainedQueryOptions } from "@/lib/react-query";
import { getCluster } from "@/api/cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useChainId } from "wagmi";
import { boolify } from "@/lib/utils/boolean";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import type { Cluster } from "@/types/api";

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

export const useCluster = (
  hash?: string,
  options?: UseQueryOptions & { watch?: boolean },
) => {
  const { clusterHash } = useClusterPageParams();
  const chainId = useChainId();

  const queryOptions = getClusterQueryOptions(hash ?? clusterHash, {
    chainId,
    options,
  });

  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData,
    structuralSharing(oldData, newData) {
      // https://tanstack.com/query/v5/docs/framework/react/guides/render-optimizations
      // This function runs after the query fetch completes to determine which data to use.
      // Since we perform optimistic updates from contract events, the cached data (oldData) may
      // be more recent than the API response (newData). We compare cluster indices to determine which data to use.
      if (!oldData && newData) return newData;
      if (!oldData && !newData) return oldData;

      const oldCluster = oldData as Cluster;
      const newCluster = newData as Cluster;
      if (+oldCluster.index > +newCluster.index) return oldData;
      return newData;
    },
  });
};
