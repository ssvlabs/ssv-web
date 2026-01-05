import { useCluster } from "./use-cluster";
import { useGetNetworkFee } from "@/lib/contract-interactions/read/use-get-network-fee";
import { useOperators } from "@/hooks/operator/use-operators";
import { combineQueryStatus } from "@/lib/react-query";
import { sumOperatorsFee } from "@/lib/utils/operator";
import { parseGwei } from "viem";
import { tryCatch } from "@/lib/utils/tryCatch";

type Options =
  | {
      deltaValidators?: bigint;
    }
  | {
      deltaEffectiveBalance?: bigint;
    };

export const getDeltaValidators = (options: Options) => {
  if ("deltaValidators" in options) return options.deltaValidators ?? 0n;
  if ("deltaEffectiveBalance" in options)
    return BigInt(options.deltaEffectiveBalance ?? 0) / parseGwei("32");
  return 0n;
};
export const useClusterBurnRate = (hash: string, options: Options = {}) => {
  const cluster = useCluster(hash);
  const networkFee = useGetNetworkFee();
  const operators = useOperators(cluster.data?.operators ?? []);
  const statuses = combineQueryStatus(networkFee, operators, cluster);

  const deltaValidators = getDeltaValidators(options);

  const hasEffectiveBalance = tryCatch(
    () => BigInt(cluster.data?.effectiveBalance ?? 0) > 0n,
    false,
  );

  const validators = hasEffectiveBalance
    ? BigInt(cluster.data!.effectiveBalance) / parseGwei("32")
    : BigInt(cluster.data?.validatorCount ?? 0);

  const burnRatePerBlock =
    sumOperatorsFee(operators.data ?? []) + (networkFee.data ?? 0n);

  return {
    data:
      statuses.isSuccess && !statuses.isError
        ? {
            burnRatePerBlock,
            clusterBurnRate: burnRatePerBlock * (validators + deltaValidators),
          }
        : undefined,
    ...statuses,
  };
};
