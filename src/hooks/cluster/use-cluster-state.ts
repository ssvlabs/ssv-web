import { useCluster } from "@/hooks/cluster/use-cluster";
import { useAccount } from "@/hooks/account/use-account";
import { formatClusterData } from "@/lib/utils/cluster";
import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { useIsLiquidated } from "@/lib/contract-interactions/read/use-is-liquidated";
import { useGetBalance } from "@/lib/contract-interactions/read/use-get-balance";

type Options = Partial<{ watch: boolean; enabled: boolean }>;
export const useClusterState = (
  hash: string,
  opts: {
    cluster?: Options;
    isLiquidated?: Options;
    balance?: Options;
  } = {},
) => {
  const account = useAccount();
  const cluster = useCluster(hash);

  const data = useMemo(
    () => ({
      clusterOwner: account.address!,
      cluster: formatClusterData(cluster.data),
      operatorIds: cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    }),
    [account.address, cluster.data],
  );

  const isLiquidated = useIsLiquidated(data, {
    watch: opts.isLiquidated?.watch,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: Boolean(
      account.address && cluster.data && (opts.isLiquidated?.enabled ?? true),
    ),
  });

  const balance = useGetBalance(data, {
    watch: isLiquidated.data ? false : opts.balance?.watch,
    retry: isLiquidated.data ? false : undefined,
    refetchOnWindowFocus: false,
    placeholderData: (prev) =>
      isLiquidated.data ? 0n : keepPreviousData(prev),
    enabled: Boolean(
      account.address &&
        cluster.data &&
        (opts.balance?.enabled ?? true) &&
        !isLiquidated.data,
    ),
  });

  return {
    cluster,
    isLiquidated,
    balance,
  };
};
