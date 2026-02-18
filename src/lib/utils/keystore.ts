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
  /** Network fee per one block */
  networkFee: bigint;
  /** Operators fee per one block */
  operatorsFee: bigint;
  liquidationCollateralPeriod: bigint;
  minimumLiquidationCollateral: bigint;
  /** Effective balance in ETH (human-readable). Examples: 32n (1 validator), 64n (2 validators) */
  effectiveBalance: bigint;
};

export const computeLiquidationCollateralCostPerValidator = ({
  networkFee,
  operatorsFee,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  effectiveBalance,
}: LiquidationCollateralCostArgs) => {
  const total =
    ((operatorsFee + networkFee) *
      liquidationCollateralPeriod *
      effectiveBalance) /
    32n;

  return (
    (bigintMax(total, minimumLiquidationCollateral) * 32n) / effectiveBalance
  );
};

type ComputeFundingCostArgs = Prettify<
  {
    fundingDays: number;
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  const effectiveBalance = args.effectiveBalance ?? 32n;

  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateral = computeLiquidationCollateralCostPerValidator({
    ...args,
    effectiveBalance,
  });

  // Subtotal = base cost × validators (scaled then unscaled)
  const networkCostSubtotal = (networkCost * effectiveBalance) / 32n;
  const operatorsCostSubtotal = (operatorsCost * effectiveBalance) / 32n;
  const liquidationCollateralSubtotal =
    (liquidationCollateral * effectiveBalance) / 32n;

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
