import { useRunway } from "@/hooks/cluster/use-calculate-runway";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterBurnRate } from "@/hooks/cluster/use-cluster-burn-rate";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";

type Options = {
  deltaBalance?: bigint;
  deltaValidators?: bigint;
  watch?: boolean;
};

export const useClusterRunway = (
  hash?: string,
  opts: Options = { deltaBalance: 0n, deltaValidators: 0n, watch: false },
) => {
  const params = useClusterPageParams();
  const clusterHash = hash ?? params.clusterHash;

  const cluster = useCluster(clusterHash);
  const balance = useClusterBalance(clusterHash!, { watch: opts.watch });
  const burnRate = useClusterBurnRate(clusterHash!, {
    deltaValidators: opts.deltaValidators,
  });

  const isLoading =
    cluster.isLoading || balance.isLoading || burnRate.isLoading;

  const runway = useRunway({
    balance: balance.data ?? 0n,
    burnRate: burnRate.data?.burnRatePerBlock ?? 0n,
    validators: BigInt(cluster.data?.validatorCount ?? 0),
    deltaValidators: opts.deltaValidators,
    deltaBalance: opts.deltaBalance,
  });

  return { ...runway, isLoading };
};
