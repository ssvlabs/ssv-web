import { useCluster } from "@/hooks/cluster/use-cluster";
import { useWithdraw } from "@/lib/contract-interactions/hooks/setter";
import { toSolidityCluster } from "@/lib/utils/cluster";
import { bigintifyNumbers } from "@/lib/utils/bigint";
import { getOperatorIds } from "@/lib/utils/operator";

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
          operatorIds: bigintifyNumbers(
            getOperatorIds(cluster.data?.operators ?? []),
          ),
          cluster: toSolidityCluster(cluster.data),
        },
        options,
      });
    },
  };
};
