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
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  const validators = BigInt(args.validators || 1);
  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateral = computeLiquidationCollateralCostPerValidator({
    ...args,
    validators,
  });

  const total =
    (networkCost + operatorsCost + liquidationCollateral) * validators;

  return {
    perValidator: {
      networkCost,
      operatorsCost,
      liquidationCollateral,
    },
    subtotal: {
      networkCost: networkCost * validators,
      operatorsCost: operatorsCost * validators,
      liquidationCollateral: liquidationCollateral * validators,
    },
    total,
  };
};
