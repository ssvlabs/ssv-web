import { useCluster } from "@/hooks/cluster/use-cluster";
import type {
  MainnetEvent,
  MutationOptions,
} from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useLiquidate } from "@/lib/contract-interactions/write/use-liquidate";
import { formatClusterData } from "@/lib/utils/cluster";
import { useAccount } from "@/hooks/account/use-account";

export const useLiquidateCluster = (clusterHash: string) => {
  const account = useAccount();
  const cluster = useCluster(clusterHash);

  const liquidate = useLiquidate();

  const write = (options: MutationOptions<MainnetEvent> = {}) => {
    if (!account.address || !cluster) {
      throw new Error("Account or cluster data not available");
    }

    return liquidate.write(
      {
        clusterOwner: account.address,
        operatorIds: cluster.data?.operators.map((id) => BigInt(id)) || [],
        cluster: formatClusterData(cluster.data),
      },
      options,
    );
  };

  return {
    ...liquidate,
    write,
  };
};
