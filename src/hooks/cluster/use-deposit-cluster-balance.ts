import { useDeposit } from "@/lib/contract-interactions/hooks/setter";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useAccount } from "@/hooks/account/use-account";
import { toSolidityCluster } from "@/lib/utils/cluster";

export const useDepositClusterBalance = (hash: string) => {
  const account = useAccount();
  const cluster = useCluster(hash);
  const deposit = useDeposit();

  type DepositWriteParam = NonNullable<Parameters<typeof deposit.write>[0]>;
  type DepositArgs = DepositWriteParam["args"];
  type DepositOptions = DepositWriteParam["options"];

  const write = (
    params: Partial<
      Pick<DepositArgs, "clusterOwner" | "operatorIds" | "cluster">
    >,
    value?: bigint,
    options?: DepositOptions,
  ) => {
    return deposit.write({
      args: {
        ...params,
        clusterOwner: account.address!,
        operatorIds:
          cluster.data?.operators.map((id) => BigInt(id)) ?? ([] as bigint[]),
        cluster: toSolidityCluster(cluster.data),
      },
      value,
      options,
    });
  };

  return {
    ...deposit,
    write,
  };
};
