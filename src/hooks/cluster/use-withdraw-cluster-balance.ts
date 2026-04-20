import { useCluster } from "@/hooks/cluster/use-cluster";
import { useWithdraw } from "@/lib/contract-interactions/hooks/setter";
import { toSolidityCluster } from "@/lib/utils/cluster";

export const useWithdrawClusterBalance = (hash: string) => {
  const cluster = useCluster(hash);
  const withdraw = useWithdraw();

  type WithdrawWriteParam = NonNullable<Parameters<typeof withdraw.write>[0]>;
  type WithdrawArgs = WithdrawWriteParam["args"];
  type WithdrawOptions = WithdrawWriteParam["options"];

  return {
    ...withdraw,
    write: (
      params: Pick<WithdrawArgs, "amount">,
      options?: WithdrawOptions,
    ) => {
      return withdraw.write({
        args: {
          ...params,
          operatorIds:
            cluster.data?.operators.map((id) => BigInt(id)) ?? ([] as bigint[]),
          cluster: toSolidityCluster(cluster.data),
        },
        options,
      });
    },
  };
};
