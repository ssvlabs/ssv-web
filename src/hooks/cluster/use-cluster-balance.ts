import { useCluster } from "@/hooks/cluster/use-cluster";
import { useGetBalance } from "@/lib/contract-interactions/read/use-get-balance";
import { useAccount } from "@/hooks/account/use-account";
import { formatClusterData } from "@/lib/utils/cluster";
import { useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";

export const useClusterBalance = (
  hash: string,
  {
    watch = false,
    enabled = true,
  }: Partial<{ watch: boolean; enabled: boolean }> = {},
) => {
  const account = useAccount();
  const cluster = useCluster(hash);

  const operatorIds = useMemo(
    () => cluster.data?.operators.map((id) => BigInt(id)) ?? [],
    [cluster.data],
  );

  return useGetBalance(
    {
      clusterOwner: account.address!,
      cluster: formatClusterData(cluster.data),
      operatorIds,
    },
    {
      watch: cluster.data?.isLiquidated ? false : watch,
      retry: cluster.data?.isLiquidated ? false : undefined,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
      enabled: Boolean(account.address && cluster.data && enabled),
    },
  );
};
