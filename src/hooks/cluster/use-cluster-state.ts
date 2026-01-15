import { useCluster } from "@/hooks/cluster/use-cluster";
import { useAccount } from "@/hooks/account/use-account";
import { toSolidityCluster } from "@/lib/utils/cluster";
import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useIsLiquidated } from "@/lib/contract-interactions/read/use-is-liquidated";
import { useGetBalance } from "@/lib/contract-interactions/read/use-get-balance";
import { useGetBalanceSSV } from "@/lib/contract-interactions/read/use-get-balance-ssv.ts";
import { useGetEffectiveBalance } from "@/lib/contract-interactions/hooks/getter.ts";

type Options = Partial<{ watch: boolean; enabled: boolean }>;
export const useClusterState = (
  hash: string,
  opts: {
    cluster?: Options;
    isLiquidated?: Options;
    balance?: Options;
    effectiveBalance?: Options;
    watch?: boolean;
  } = {},
) => {
  const account = useAccount();
  const cluster = useCluster(hash, { watch: opts.watch });
  const clusterSnapshot = useMemo(
    () => ({
      clusterOwner: account.address!,
      cluster: toSolidityCluster(cluster.data),
      operatorIds: cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    }),
    [account.address, cluster.data],
  );

  const isLiquidated = useIsLiquidated(clusterSnapshot, {
    watch: opts.isLiquidated?.watch,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: Boolean(
      account.address && cluster.data && (opts.isLiquidated?.enabled ?? true),
    ),
  });

  const balanceETH = useGetBalance(clusterSnapshot, {
    watch: isLiquidated.data ? false : opts.balance?.watch,
    retry: isLiquidated.data ? false : undefined,
    refetchOnWindowFocus: false,
    placeholderData: (prev) =>
      isLiquidated.data
        ? 0n
        : keepPreviousData(prev) || BigInt(cluster.data?.ethBalance || 0),
    enabled: Boolean(
      account.address &&
        cluster.data &&
        (opts.balance?.enabled ?? true) &&
        !isLiquidated.data,
    ),
  });

  const balanceSSV = useGetBalanceSSV(clusterSnapshot, {
    watch: isLiquidated.data ? false : opts.balance?.watch,
    retry: isLiquidated.data ? false : undefined,
    refetchOnWindowFocus: false,
    placeholderData: (prev) =>
      isLiquidated.data
        ? 0n
        : keepPreviousData(prev) || BigInt(cluster.data?.balance || 0),
    enabled: Boolean(
      account.address &&
        cluster.data &&
        (opts.balance?.enabled ?? true) &&
        !isLiquidated.data,
    ),
  });

  const effectiveBalance = useGetEffectiveBalance(clusterSnapshot, {
    watch: isLiquidated.data ? false : opts.effectiveBalance?.watch,
    retry: isLiquidated.data ? false : undefined,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => {
      return (
        keepPreviousData(prev) ?? (Number(cluster.data?.effectiveBalance) || 0)
      );
    },
    enabled: Boolean(
      account.address &&
        cluster.data &&
        (opts.effectiveBalance?.enabled ?? true) &&
        !isLiquidated.data,
    ),
  });

  return {
    cluster,
    isLiquidated,
    balanceETH,
    balanceSSV,
    effectiveBalance,
  };
};
