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
 * for liquidated clusters. While the contract call is in flight, disabled or
 * failing, `data` falls back to the API field `cluster.data.effectiveBalance`
 * (0 until the cluster itself has loaded). The contract query's own status
 * fields (isError, fetchStatus, …) are passed through unchanged.
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

  const effectiveBalance = useGetEffectiveBalance(snapshot, {
    placeholderData: keepPreviousData,
    // `select` only runs once the read has data, so the API fallback lives
    // below rather than in here.
    select: (data) => BigInt(data!),
    retry: 2,
    networkMode: "always",
    watch,
    enabled: Boolean(cluster.data && enabled && !isLiquidated.data),
  });

  return {
    ...effectiveBalance,
    data: effectiveBalance.data ?? BigInt(cluster.data?.effectiveBalance ?? 0),
  };
};
