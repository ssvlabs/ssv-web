import { getClusterQueryOptions } from "@/hooks/cluster/use-cluster";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { operatorsQueryOptions } from "@/hooks/operator/use-operators";
import { queryClient } from "@/lib/react-query";
import { getOperatorIds, sortOperators } from "@/lib/utils/operator";
import type { Cluster } from "@/types/api";

/**
 * Seeds the per-cluster, per-operator-list, and per-operator caches from a
 * cluster object that was fetched as part of a larger payload (e.g. paginated
 * clusters). Opening the related detail pages afterwards renders instantly
 * from cache instead of triggering a fresh fetch.
 */
export const seedClusterCache = (cluster: Cluster) => {
  queryClient.setQueryData(
    getClusterQueryOptions(cluster.clusterId).queryKey,
    cluster,
  );

  const ids = getOperatorIds(cluster.operators);
  queryClient.setQueryData(
    operatorsQueryOptions(ids).queryKey,
    sortOperators(cluster.operators),
  );

  cluster.operators.forEach((operator) => {
    queryClient.setQueryData(
      getOperatorQueryOptions(operator.id).queryKey,
      operator,
    );
  });
};
