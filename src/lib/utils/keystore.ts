import { globals } from "@/config";
import { bigintMax } from "./bigint";
import type { Prettify } from "@/types/ts-utils";
import { formatETH } from "@/lib/utils/number";

const SCALE = 10 ** 6;
const SCALE_N = BigInt(SCALE);

export const computeDailyAmount = (value: bigint, days: number) => {
  const scaledDays = BigInt(days * SCALE);
  return (value * scaledDays * BigInt(globals.BLOCKS_PER_DAY)) / SCALE_N;
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
  const validatorsScaled = (effectiveBalance * SCALE_N) / 32n || SCALE_N;
  const total =
    (operatorsFee + networkFee) *
    liquidationCollateralPeriod *
    validatorsScaled;

  return (
    bigintMax(total, minimumLiquidationCollateral * SCALE_N) / validatorsScaled
  );
};

type ComputeFundingCostArgs = Prettify<
  {
    fundingDays: number;
    effectiveBalance?: bigint;
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  const effectiveBalance = args.effectiveBalance ?? 32n;
  const vUnitsScaled = (effectiveBalance * SCALE_N) / 32n || SCALE_N;

  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateral = computeLiquidationCollateralCostPerValidator({
    ...args,
    effectiveBalance,
  });

  // Subtotal = base cost × validators (scaled then unscaled)
  const networkCostSubtotal = (networkCost * vUnitsScaled) / SCALE_N;
  const operatorsCostSubtotal = (operatorsCost * vUnitsScaled) / SCALE_N;
  const liquidationCollateralSubtotal =
    (liquidationCollateral * vUnitsScaled) / SCALE_N;

  const total =
    networkCostSubtotal + operatorsCostSubtotal + liquidationCollateralSubtotal;

  return {
    perValidator: {
      networkCost: networkCost,
      operatorsCost,
      liquidationCollateral,
    },
    subtotal: {
      networkCost: networkCostSubtotal,
      operatorsCost: operatorsCostSubtotal,
      liquidationCollateral: liquidationCollateralSubtotal,
    },
    total,
    formatted: {
      perValidator: {
        networkCost: formatETH(networkCost),
        operatorsCost: formatETH(operatorsCost),
        liquidationCollateral: formatETH(liquidationCollateral),
      },
      subtotal: {
        networkCost: formatETH(networkCostSubtotal),
        operatorsCost: formatETH(operatorsCostSubtotal),
        liquidationCollateral: formatETH(liquidationCollateralSubtotal),
      },
      total: formatETH(total),
    },
  };
};
