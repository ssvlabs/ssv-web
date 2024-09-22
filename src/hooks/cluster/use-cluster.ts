import { queryOptions, useQuery } from "@tanstack/react-query";

import type { QueryConfig } from "@/lib/react-query";
import { getCluster } from "@/api/cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";

export const getClusterQueryOptions = (hash?: string) => {
  return queryOptions({
    queryKey: ["cluster", hash?.toLowerCase()],
    queryFn: () => getCluster(hash!),
    enabled: Boolean(hash),
  });
};

type UseClusterOptions = QueryConfig<typeof getClusterQueryOptions>;

export const useCluster = (hash?: string, options?: UseClusterOptions) => {
  const { clusterHash } = useClusterPageParams();
  const queryOptions = getClusterQueryOptions(hash ?? clusterHash);
  return useQuery({
    ...queryOptions,
    ...options,
    enabled: queryOptions.enabled && options?.enabled,
  });
};
