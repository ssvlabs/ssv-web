import { useRunway } from "@/hooks/cluster/use-calculate-runway";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import {
  getDeltaValidators,
  useClusterBurnRate,
} from "@/hooks/cluster/use-cluster-burn-rate";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { tryCatch } from "@/lib/utils/tryCatch.ts";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard.tsx";

type Options = {
  deltaBalance?: bigint;
  watch?: boolean;
} & ({ deltaValidators?: bigint } | { deltaEffectiveBalance?: bigint });

export const useClusterRunway = (
  hash?: string,
  opts: Options = {
    deltaBalance: 0n,
    deltaValidators: 0n,
    deltaEffectiveBalance: 0n,
    watch: false,
  },
) => {
  const params = useClusterPageParams();
  const clusterHash = hash ?? params.clusterHash;

  const deltaValidators = getDeltaValidators(opts);

  const cluster = useCluster(clusterHash);
  const balance = useClusterBalance(clusterHash!, { watch: opts.watch });
  const burnRate = useClusterBurnRate(clusterHash!, { deltaValidators });
  const { state } = useRegisterValidatorContext;

  const hasEffectiveBalance = tryCatch(
    () => BigInt(cluster.data?.effectiveBalance ?? 0) + state.effectiveBalance > 0n,
    false,
  );
  const validators = hasEffectiveBalance
    ? (BigInt(cluster.data?.effectiveBalance ?? 0) + state.effectiveBalance) / 32n
    : BigInt(cluster.data?.validatorCount ?? 0);

  const isLoading =
    cluster.isLoading || balance.isLoading || burnRate.isLoading;

  const runway = useRunway({
    balance: balance.data.eth ?? balance.data.ssv ?? 0n,
    burnRate: burnRate.data?.burnRatePerBlock ?? 0n,
    validators,
    deltaValidators: deltaValidators,
    deltaBalance: opts.deltaBalance,
  });

  return { ...runway, isLoading };
};
