import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterSnapshot } from "@/hooks/cluster/use-cluster-snapshot";
import { useIsLiquidated } from "@/lib/contract-interactions/hooks/getter";
import { keepPreviousData } from "@tanstack/react-query";

/**
 * Returns the live on-chain liquidation state of a cluster by calling
 * `SSVNetworkViews.isLiquidated(owner, operatorIds, cluster)`.
 *
 * While the contract call is in flight (or disabled), the hook falls back to
 * the API field `cluster.data.isLiquidated`, so consumers always see a defined
 * boolean.
 */
export const useIsClusterLiquidated = (
  hash: string,
  {
    watch = false,
    enabled = true,
  }: Partial<{ watch: boolean; enabled: boolean }> = {},
) => {
  const cluster = useCluster(hash);
  const snapshot = useClusterSnapshot(cluster.data);

  const query = useIsLiquidated(snapshot, {
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    watch,
    enabled: Boolean(cluster.data && enabled),
  });

  return {
    ...query,
    data: query.data ?? Boolean(cluster.data?.isLiquidated),
  };
};
