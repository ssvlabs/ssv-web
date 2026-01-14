import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard.tsx";
import { bigintMax } from "@/lib/utils/bigint";
import { calculateRunway } from "@/lib/utils/cluster";
import { useNetworkFee, useNetworkFeeSSV } from "@/hooks/use-ssv-network-fee";
import { sumOperatorsFee } from "@/lib/utils/operator";
import { useOperators } from "@/hooks/operator/use-operators";

const getDeltaValidators = (options: Options) => {
  if ("deltaValidators" in options) return options.deltaValidators ?? 0n;
  if ("deltaEffectiveBalance" in options)
    return BigInt(options.deltaEffectiveBalance ?? 0) / 32n;
  return 0n;
};

type Options = {
  deltaBalance?: bigint;
  watch?: boolean;
  forceMode?: "eth" | "ssv";
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
  const { state } = useRegisterValidatorContext;

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

  const operatorFees =
    sumOperatorsFee(operators.data ?? [], isETH ? "eth" : "ssv") + networkFee;

  const feesPerBlock = operatorFees + networkFee;

  const clusterEffectiveBalance = BigInt(cluster.data?.effectiveBalance ?? 0);
  const minClusterEffectiveBalance =
    BigInt(cluster.data?.validatorCount ?? 1) * 32n;

  const effectiveBalance = bigintMax(
    clusterEffectiveBalance,
    minClusterEffectiveBalance,
  );

  const validators = (effectiveBalance + state.effectiveBalance) / 32n;

  const isLoading =
    cluster.isLoading ||
    balance.isLoading ||
    operators.isLoading ||
    ethNetworkFee.isLoading ||
    ssvNetworkFee.isLoading;

  const runway = calculateRunway({
    balance: balance.data.eth ?? balance.data.ssv ?? 0n,
    feesPerBlock,
    validators,
    deltaValidators: deltaValidators,
    deltaBalance: opts.deltaBalance ?? 0n,
    liquidationThresholdBlocks,
    minimumLiquidationCollateral,
  });

  return { data: runway, isLoading };
};
