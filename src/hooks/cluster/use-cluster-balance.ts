import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterSnapshot } from "@/hooks/cluster/use-cluster-snapshot";
import {
  useGetBalance,
  useGetBalanceSSV,
} from "@/lib/contract-interactions/hooks/getter";
import { keepPreviousData } from "@tanstack/react-query";

/**
 * Returns the correct cluster balance based on the cluster's `migrated` value.
 *
 * - If the cluster is migrated, it fetches the ETH balance from the contract
 *   (via `useGetBalance`) and returns it with `token: "ETH"`.
 * - If the cluster is not migrated, it fetches the SSV balance from the
 *   contract (via `useGetBalanceSSV`) and returns it with `token: "SSV"`.
 *
 * While the on-chain call is loading (or if it fails), the hook falls back to
 * the balance reported by the API (`ethBalance` for migrated clusters,
 * `balance` for non-migrated ones).
 */
export const useClusterBalance = (
  hash: string,
  {
    watch: _watch = false,
    enabled: _enabled = true,
  }: Partial<{ watch: boolean; enabled: boolean }> = {},
) => {
  const cluster = useCluster(hash);
  const snapshot = useClusterSnapshot(cluster.data);

  const isMigrated = Boolean(cluster.data?.migrated);
  const enabled = Boolean(cluster.data && _enabled);

  const watch = cluster.data?.isLiquidated ? false : _watch;
  const retry = cluster.data?.isLiquidated ? false : undefined;

  const eth = useGetBalance(snapshot, {
    placeholderData: keepPreviousData,
    watch,
    retry,
    enabled: enabled && isMigrated,
  });

  const ssv = useGetBalanceSSV(snapshot, {
    placeholderData: keepPreviousData,
    watch,
    retry,
    enabled: enabled && !isMigrated,
  });

  const active = isMigrated ? eth : ssv;
  const fallback = isMigrated
    ? BigInt(cluster.data?.ethBalance || 0)
    : BigInt(cluster.data?.balance || 0);

  return {
    ...active,
    data: active.data ?? fallback,
    token: isMigrated ? ("ETH" as const) : ("SSV" as const),
  };
};
