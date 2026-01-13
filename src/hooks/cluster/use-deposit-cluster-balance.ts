import { useDeposit } from "@/lib/contract-interactions/write/use-deposit";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useAccount } from "@/hooks/account/use-account";
import { toSolidityCluster } from "@/lib/utils/cluster";

export const useDepositClusterBalance = (hash: string) => {
  const account = useAccount();
  const cluster = useCluster(hash);
  const deposit = useDeposit();

  type WriteParams = Parameters<typeof deposit.write>;

  return {
    ...deposit,
    write: (
      params: Pick<WriteParams[0], "amount">,
      options?: WriteParams[2],
    ) => {
      return deposit.write(
        {
          ...params,
          clusterOwner: account.address!,
          operatorIds:
            cluster.data?.operators.map((id) => BigInt(id)) ?? ([] as bigint[]),
          cluster: toSolidityCluster(cluster.data),
        },
        params.amount,
        options,
      );
    },
  };
};
