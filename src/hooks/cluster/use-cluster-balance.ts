import { useCluster } from "@/hooks/cluster/use-cluster";
import { useAccount } from "@/hooks/account/use-account";
import { toSolidityCluster } from "@/lib/utils/cluster";
import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { combineQueryStatus } from "@/lib/react-query";
import {
  useGetBalance,
  useGetBalanceSSV,
} from "@/lib/contract-interactions/hooks/getter";

export const useClusterBalance = (
  hash: string,
  {
    watch: _watch = false,
    enabled: _enabled = true,
  }: Partial<{ watch: boolean; enabled: boolean }> = {},
) => {
  const account = useAccount();
  const cluster = useCluster(hash);
  console.log("cluster:", cluster);
  const clusterSnapshot = useMemo(
    () => ({
      clusterOwner: account.address!,
      cluster: toSolidityCluster(cluster.data),
      operatorIds: cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    }),
    [account.address, cluster.data],
  );

  const enabled = Boolean(account.address && cluster.data && _enabled);

  const watch = cluster.data?.isLiquidated ? false : _watch;
  const retry = cluster.data?.isLiquidated ? false : undefined;

  const eth = useGetBalance(clusterSnapshot, {
    placeholderData: keepPreviousData,
    watch,
    retry,
    enabled,
  });

  const ssv = useGetBalanceSSV(clusterSnapshot, {
    placeholderData: keepPreviousData,
    watch,
    retry,
    enabled,
  });

  return {
    ...combineQueryStatus(eth, ssv),
    data: {
      eth: eth.data || BigInt(cluster.data?.ethBalance || 0),
      ssv: ssv.data || BigInt(cluster.data?.balance || 0),
    },
  };
};
