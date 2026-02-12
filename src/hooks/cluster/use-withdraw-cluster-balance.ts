import { useCluster } from "@/hooks/cluster/use-cluster";
import { useWithdraw } from "@/lib/contract-interactions/write/use-withdraw";
import { formatClusterData } from "@/lib/utils/cluster";

export const useWithdrawClusterBalance = (hash: string) => {
  const cluster = useCluster(hash);
  const withdraw = useWithdraw();

  type WriteParams = Parameters<typeof withdraw.write>;

  return {
    ...withdraw,
    write: (
      params: Pick<WriteParams["0"], "amount">,
      options?: WriteParams["1"],
    ) => {
      return withdraw.write(
        {
          ...params,
          operatorIds:
            cluster.data?.operators.map((id) => BigInt(id)) ?? ([] as bigint[]),
          cluster: formatClusterData(cluster.data),
        },
        options,
      );
    },
  };
};
