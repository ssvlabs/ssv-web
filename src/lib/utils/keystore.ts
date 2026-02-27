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

export const effectiveBalanceToVUnits = (effectiveBalance: bigint): bigint => {
  const scaled = effectiveBalance * globals.VUNITS_PRECISION;
  const vUnitsPerValidator = globals.DEFAULT_EB_PER_VALIDATOR;
  return scaled === 0n ? 0n : (scaled - 1n) / vUnitsPerValidator + 1n;
};

export const computeLiquidationCollateralCostPerValidator = ({
  networkFee,
  operatorsFee,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  effectiveBalance,
}: LiquidationCollateralCostArgs) => {
  const liquidationCollateralSubtotal = computeLiquidationCollateralSubtotal({
    networkFee,
    operatorsFee,
    liquidationCollateralPeriod,
    minimumLiquidationCollateral,
    effectiveBalance,
  });
  const vUnits = effectiveBalanceToVUnits(effectiveBalance);
  if (vUnits === 0n) return 0n;

  return (liquidationCollateralSubtotal * globals.VUNITS_PRECISION) / vUnits;
};

export const computeLiquidationCollateralSubtotal = ({
  networkFee,
  operatorsFee,
  liquidationCollateralPeriod,
  minimumLiquidationCollateral,
  effectiveBalance,
}: LiquidationCollateralCostArgs): bigint => {
  const vUnits = effectiveBalanceToVUnits(effectiveBalance);
  if (vUnits === 0n) return 0n;

  return bigintMax(
    ((operatorsFee + networkFee) * liquidationCollateralPeriod * vUnits) /
      globals.VUNITS_PRECISION,
    minimumLiquidationCollateral,
  );
};

type ComputeFundingCostArgs = Prettify<
  {
    fundingDays: number;
  } & LiquidationCollateralCostArgs
>;

export const computeFundingCost = (args: ComputeFundingCostArgs) => {
  const effectiveBalance = args.effectiveBalance ?? 32n;
  const vUnits = effectiveBalanceToVUnits(effectiveBalance);

  const networkCost = computeDailyAmount(args.networkFee, args.fundingDays);
  const operatorsCost = computeDailyAmount(args.operatorsFee, args.fundingDays);
  const liquidationCollateralSubtotal = computeLiquidationCollateralSubtotal({
    ...args,
    effectiveBalance,
  });
  const liquidationCollateral = computeLiquidationCollateralCostPerValidator({
    ...args,
    effectiveBalance,
  });

  // Contract parity: scale costs by vUnits (ceil(EB * 10_000 / 32)).
  const networkCostSubtotal = (networkCost * vUnits) / globals.VUNITS_PRECISION;
  const operatorsCostSubtotal =
    (operatorsCost * vUnits) / globals.VUNITS_PRECISION;

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
