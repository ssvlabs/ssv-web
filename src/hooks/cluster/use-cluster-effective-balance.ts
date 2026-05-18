import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterSnapshot } from "@/hooks/cluster/use-cluster-snapshot";
import { useIsClusterLiquidated } from "@/hooks/cluster/use-is-cluster-liquidated";
import { useGetEffectiveBalance } from "@/lib/contract-interactions/hooks/getter";
import { keepPreviousData } from "@tanstack/react-query";

/**
 * Returns the cluster's on-chain effective balance by calling
 * `SSVNetworkViews.getEffectiveBalance(owner, operatorIds, cluster)`.
 *
 * Only meaningful for migrated (ETH) clusters — the contract call is disabled
 * for non-migrated clusters and for liquidated clusters. While the contract
 * call is in flight (or disabled), the hook falls back to the API field
 * `cluster.data.effectiveBalance`.
 */
export const useClusterEffectiveBalance = (
  hash: string,
  {
    watch = false,
    enabled = true,
  }: Partial<{ watch: boolean; enabled: boolean }> = {},
) => {
  const cluster = useCluster(hash, { watch });
  const isLiquidated = useIsClusterLiquidated(hash, { watch });
  const snapshot = useClusterSnapshot(cluster.data);

  return useGetEffectiveBalance(snapshot, {
    placeholderData: keepPreviousData,
    select: (data) => BigInt(data ?? cluster.data?.effectiveBalance ?? 0),
    watch,
    enabled: Boolean(cluster.data && enabled && !isLiquidated.data),
  });
};
