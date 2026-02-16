import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { calculateRunway } from "@/lib/utils/cluster";
import { useNetworkFee, useNetworkFeeSSV } from "@/hooks/use-ssv-network-fee";
import { sumOperatorsFee } from "@/lib/utils/operator";
import { useOperators } from "@/hooks/operator/use-operators";

const getDeltaValidators = (options: Options): number => {
  if ("deltaValidators" in options) return options.deltaValidators ?? 0;
  if ("deltaEffectiveBalance" in options) {
    const deltaEffectiveBalance = options.deltaEffectiveBalance ?? 0n;
    return Number(deltaEffectiveBalance) / 32;
  }
  return 0;
};

type Options = {
  deltaBalance?: bigint;
  watch?: boolean;
  forceMode?: "eth" | "ssv";
} & ({ deltaValidators?: number } | { deltaEffectiveBalance?: bigint });

export const useClusterRunway = (
  hash?: string,
  opts: Options = {
    deltaBalance: 0n,
    deltaValidators: 0,
    deltaEffectiveBalance: 0n,
    watch: false,
  },
) => {
  const params = useClusterPageParams();
  const clusterHash = hash ?? params.clusterHash;

  const deltaValidators = getDeltaValidators(opts);

  const cluster = useCluster(clusterHash, { watch: opts.watch });
  const balance = useClusterBalance(clusterHash!, { watch: opts.watch });
  const operators = useOperators(cluster.data?.operators ?? []);

  const isETH =
    opts.forceMode === "eth" ||
    ((!opts.forceMode && cluster.data?.migrated) ?? false);
  const ethNetworkFee = useNetworkFee();
  const ssvNetworkFee = useNetworkFeeSSV();

  const {
    liquidationThresholdPeriod: { data: liquidationThresholdBlocks = 0n },
    minimumLiquidationCollateral: { data: minimumLiquidationCollateral = 0n },
    ssvNetworkFee: { data: networkFee = 0n },
  } = isETH ? ethNetworkFee : ssvNetworkFee;

  const operatorFees = sumOperatorsFee(
    operators.data ?? [],
    isETH ? "eth" : "ssv",
  );

  const feesPerBlock = operatorFees + networkFee;

  const validators = isETH
    ? Math.max(
        Number(cluster.data?.effectiveBalance ?? 0),
        (cluster.data?.validatorCount ?? 1) * 32,
      ) / 32
    : cluster.data?.validatorCount ?? 1;

  const isLoading =
    cluster.isLoading ||
    balance.isLoading ||
    operators.isLoading ||
    ethNetworkFee.isLoading ||
    ssvNetworkFee.isLoading;

  const runway = calculateRunway({
    balance: (isETH ? balance.data.eth : balance.data.ssv) || 0n,
    feesPerBlock,
    validators,
    deltaValidators: deltaValidators,
    deltaBalance: opts.deltaBalance ?? 0n,
    liquidationThresholdBlocks,
    minimumLiquidationCollateral,
  });

  return { data: runway, isLoading };
};
