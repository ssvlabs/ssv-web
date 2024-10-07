import { useCluster } from "./use-cluster";
import { useGetNetworkFee } from "@/lib/contract-interactions/read/use-get-network-fee";
import { useOperators } from "@/hooks/operator/use-operators";
import { combineQueryStatus } from "@/lib/react-query";
import { sumOperatorsFee } from "@/lib/utils/operator";

type Options = {
  deltaValidators?: bigint;
};

export const useClusterBurnRate = (
  hash: string,
  { deltaValidators = 0n }: Options = {},
) => {
  const cluster = useCluster(hash);
  const networkFee = useGetNetworkFee();
  const operators = useOperators(cluster.data?.operators ?? []);
  const statuses = combineQueryStatus(networkFee, operators, cluster);

  const burnRatePerBlock =
    sumOperatorsFee(operators.data ?? []) + (networkFee.data ?? 0n);
  return {
    data:
      statuses.isSuccess && !statuses.isError
        ? {
            burnRatePerBlock,
            clusterBurnRate:
              burnRatePerBlock *
              (BigInt(cluster.data?.validatorCount ?? 0) + deltaValidators),
          }
        : undefined,
    ...statuses,
  };
};
