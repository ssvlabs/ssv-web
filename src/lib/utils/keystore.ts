import { globals } from "@/config";
import { bigintMax } from "./bigint";
import type { Prettify } from "@/types/ts-utils";

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
  validators?: bigint;
};

export const computeLiquidationCollateralCostPerValidator = ({
  networkFee,
  operatorsFee,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  validators = 1n,
}: LiquidationCollateralCostArgs) => {
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
  const validators = BigInt(args.validators || 1);
  const effectiveBalance = args.effectiveBalance || 0n;

  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateral = computeLiquidationCollateralCostPerValidator({
    ...args,
    validators,
  });

  // Subtotal = base cost × effective balance × validators
  const networkCostSubtotal = networkCost * (effectiveBalance / 32n);
  const operatorsCostSubtotal = operatorsCost * (effectiveBalance / 32n);
  const liquidationCollateralSubtotal =
    liquidationCollateral * (effectiveBalance / 32n);

  const total =
    networkCostSubtotal + operatorsCostSubtotal + liquidationCollateralSubtotal;

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
    effectiveBalance,
  };
};
