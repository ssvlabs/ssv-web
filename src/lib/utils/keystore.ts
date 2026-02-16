import { globals } from "@/config";
import { bigintMax } from "./bigint";
import type { Prettify } from "@/types/ts-utils";
import { calculateRunway } from "@/lib/utils/cluster";

export const computeDailyAmount = (value: bigint, days: number) => {
  const scale = 10 ** 6;
  const scaledDays = BigInt(days * scale);
  return (value * scaledDays * BigInt(globals.BLOCKS_PER_DAY)) / BigInt(scale);
};

type LiquidationCollateralCostArgs = {
  networkFee: bigint;
  operatorsFee: bigint;
  liquidationCollateralPeriod: bigint;
  minimumLiquidationCollateral: bigint;
  effectiveBalance: bigint;
};

export const computeLiquidationCollateralCostPerValidator = ({
  networkFee,
  operatorsFee,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  effectiveBalance,
}: LiquidationCollateralCostArgs) => {
  const eb = effectiveBalance || 32n;
  const validators = eb / 32n || 1n;
  // Multiply before dividing to preserve precision for non-32-multiple EBs
  const total =
    (operatorsFee + networkFee) *
    liquidationCollateralPeriod *
    eb / 32n;

  return bigintMax(total, minimumLiquidationCollateral) / validators;
};

type ComputeFundingCostArgs = Prettify<
  {
    fundingDays: number;
    effectiveBalance?: bigint;
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  const eb = args.effectiveBalance || 32n;
  const validators = eb / 32n || 1n;

  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateral =
    computeLiquidationCollateralCostPerValidator(args);

  // Multiply before dividing to preserve precision for non-32-multiple EBs
  const networkCostSubtotal = (networkCost * eb) / 32n;
  const operatorsCostSubtotal = (operatorsCost * eb) / 32n;
  const liquidationCollateralSubtotal = liquidationCollateral * validators;

  const total =
    networkCostSubtotal + operatorsCostSubtotal + liquidationCollateralSubtotal;

  const runway = calculateRunway({
    balance: total,
    feesPerBlock: args.networkFee + args.operatorsFee,
    effectiveBalance: eb,
    liquidationThresholdBlocks: args.liquidationCollateralPeriod,
    minimumLiquidationCollateral: args.minimumLiquidationCollateral,
  });

  return {
    perValidator: {
      networkCost,
      operatorsCost,
      liquidationCollateral,
    },
    subtotal: {
      networkCost: networkCostSubtotal,
      operatorsCost: operatorsCostSubtotal,
      liquidationCollateral: liquidationCollateralSubtotal,
    },
    total,
    runway,
    effectiveBalance: args.effectiveBalance,
  };
};
