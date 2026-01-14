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
  const validators = effectiveBalance / 32n || 1n;
  const total =
    (operatorsFee + networkFee) *
    liquidationCollateralPeriod *
    BigInt(validators);

  return bigintMax(total, minimumLiquidationCollateral) / validators;
};

type ComputeFundingCostArgs = Prettify<
  {
    fundingDays: number;
    effectiveBalance?: bigint;
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  const validators = args.effectiveBalance / 32n || 1n;

  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateral =
    computeLiquidationCollateralCostPerValidator(args);

  // Subtotal = base cost × effective balance × validators
  const networkCostSubtotal = networkCost * validators;
  const operatorsCostSubtotal = operatorsCost * validators;
  const liquidationCollateralSubtotal = liquidationCollateral * validators;

  const total =
    networkCostSubtotal + operatorsCostSubtotal + liquidationCollateralSubtotal;

  const runway = calculateRunway({
    balance: total,
    feesPerBlock: args.networkFee + args.operatorsFee,
    validators,
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
