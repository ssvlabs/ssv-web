import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { bigintMax } from "@/lib/utils/bigint";
import { calculateRunway } from "@/lib/utils/cluster";
import { useNetworkFee, useNetworkFeeSSV } from "@/hooks/use-ssv-network-fee";
import { sumOperatorsFee } from "@/lib/utils/operator";
import { useRefetchWhileUnavailable, withUnavailable } from "@/lib/react-query";

const getDeltaEffectiveBalance = (options: Options) => {
  if ("deltaValidators" in options)
    return (options.deltaValidators ?? 0n) * 32n;
  if ("deltaEffectiveBalance" in options)
    return BigInt(options.deltaEffectiveBalance ?? 0);
  return 0n;
};

type Options = {
  deltaBalance?: bigint;
  watch?: boolean;
  effectiveBalance?: bigint;
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

  const deltaEffectiveBalance = getDeltaEffectiveBalance(opts);

  const cluster = useCluster(clusterHash, { watch: opts.watch });
  const balance = useClusterBalance(clusterHash!, { watch: opts.watch });

  const isETH = cluster.data?.migrated ?? false;

  const ethNetworkFee = useNetworkFee(isETH);
  const ssvNetworkFee = useNetworkFeeSSV(!isETH);

  const {
    liquidationThresholdPeriod: { data: liquidationThresholdBlocks = 0n },
    minimumLiquidationCollateral: { data: minimumLiquidationCollateral = 0n },
    ssvNetworkFee: { data: networkFee = 0n },
  } = isETH ? ethNetworkFee : ssvNetworkFee;

  const operatorFees = sumOperatorsFee(
    cluster.data?.operators ?? [],
    isETH ? "eth" : "ssv",
  );

  const feesPerBlock = operatorFees + networkFee;

  const effectiveBalance =
    opts.effectiveBalance ??
    (isETH
      ? bigintMax(
          BigInt(cluster.data?.effectiveBalance ?? 0),
          BigInt(cluster.data?.validatorCount ?? 1) * 32n,
        )
      : BigInt(cluster.data?.validatorCount ?? 1) * 32n);

  const isLoading =
    cluster.isLoading ||
    balance.isLoading ||
    ethNetworkFee.isLoading ||
    ssvNetworkFee.isLoading;

  // `data` below is computed from `?? 0n` defaults and the API balance
  // snapshot, so it can't tell a real runway from a failed read. Only the
  // active (ETH or SSV) param set counts; the inactive one is disabled.
  // getBalance reverts for liquidated clusters, so its error is expected there
  // and the runway keeps today's behaviour.
  // Without the cluster itself (operators, migrated flag, EB) there is no
  // runway to show either: unavailable when that read failed, idle when it is
  // disabled (no hash).
  const isClusterLiquidated = Boolean(cluster.data?.isLiquidated);
  const clusterStatus = withUnavailable(cluster, [cluster]);
  const balanceStatus = withUnavailable(balance, [balance]);
  const networkStatus = isETH ? ethNetworkFee : ssvNetworkFee;
  const isUnavailable =
    (!cluster.data && clusterStatus.isUnavailable) ||
    (!isClusterLiquidated && balanceStatus.isUnavailable) ||
    networkStatus.isUnavailable;
  const isPending =
    !isUnavailable &&
    (clusterStatus.isPending ||
      balanceStatus.isPending ||
      networkStatus.isPending);
  const isIdle = !isUnavailable && !isPending && !cluster.data;

  // Callers without `watch` never refetch a failed cluster/balance read; the
  // network params retry themselves in useNetworkFee / useNetworkFeeSSV.
  // The balance read is disabled until the cluster is known (and reverts for
  // liquidated clusters), so only retry it once there is a cluster to read.
  useRefetchWhileUnavailable(
    cluster.data && !isClusterLiquidated ? [cluster, balance] : [cluster],
    isUnavailable,
  );

  const runway = calculateRunway({
    balance: balance.data ?? 0n,
    feesPerBlock,
    effectiveBalance,
    deltaEffectiveBalance,
    deltaBalance: opts.deltaBalance ?? 0n,
    liquidationThresholdBlocks,
    minimumLiquidationCollateral,
  });

  return { data: runway, isLoading, isUnavailable, isPending, isIdle };
};
