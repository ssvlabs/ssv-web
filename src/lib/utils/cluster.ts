import { globals } from "@/config";
import {
  bigintifyNumbers,
  bigintMax,
  stringifyBigints,
} from "@/lib/utils/bigint";
import { effectiveBalanceToVUnits } from "@/lib/utils/keystore";
import { numberFormatter, sortNumbers } from "@/lib/utils/number";
import { getOperatorIds } from "@/lib/utils/operator";
import { add0x } from "@/lib/utils/strings";
import type {
  Cluster,
  Operator,
  SolidityCluster,
  Validator,
} from "@/types/api";
import type { Address } from "abitype";
import { isNumber, merge } from "lodash-es";
import { encodePacked, keccak256, zeroAddress } from "viem";

export const createClusterHash = (
  account: Address,
  operators: readonly (Operator | number)[],
) =>
  keccak256(
    encodePacked(
      ["address", "uint256[]"],
      [
        account,
        sortNumbers(
          operators.map((o) => {
            return BigInt(isNumber(o) ? o : o.id);
          }),
        ),
      ],
    ),
  );

export const getDefaultClusterData = (
  cluster: Partial<SolidityCluster> = {},
): SolidityCluster =>
  merge(
    {
      validatorCount: 0,
      networkFeeIndex: 0n,
      index: 0n,
      balance: 0n,
      active: true,
    },
    cluster,
  );

export const toSolidityCluster = (
  cluster?: Partial<Cluster> | null,
): SolidityCluster => ({
  active: cluster?.active ?? true,
  balance: cluster?.migrated
    ? BigInt(cluster?.ethBalance ?? 0)
    : BigInt(cluster?.balance ?? 0),
  index: BigInt(cluster?.index ?? 0),
  networkFeeIndex: BigInt(cluster?.networkFeeIndex ?? 0),
  validatorCount: cluster?.validatorCount ?? 0,
});

/**
 * Builds the `{ clusterOwner, cluster, operatorIds }` snapshot used as input
 * for SSVNetworkViews contract calls (e.g. `getBalance`, `getEffectiveBalance`,
 * `isLiquidated`).
 *
 * The owner is read directly from `cluster.ownerAddress` — these contract
 * calls are owner-scoped, and the cluster always carries its own owner.
 */
export const toSolidityClusterSnapshot = (
  cluster?: Partial<Cluster> | null,
) => ({
  clusterOwner: (cluster?.ownerAddress ?? zeroAddress) as Address,
  cluster: toSolidityCluster(cluster),
  operatorIds: bigintifyNumbers(getOperatorIds(cluster?.operators ?? [])),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mergeClusterSnapshot = <T extends Cluster<any>>(
  cluster: T,
  solidityCluster: SolidityCluster,
  additionalData: Partial<T> = {},
): T => {
  const isMigrated = cluster.migrated;
  const { balance, ...rest } = solidityCluster;
  const balanceProperty = (
    isMigrated ? "ethBalance" : "balance"
  ) satisfies keyof Cluster;

  return merge(
    {},
    cluster,
    stringifyBigints(rest),
    { [balanceProperty]: balance.toString() },
    additionalData,
  );
};

export const filterOutRemovedValidators = (
  fetchedValidators: Validator[],
  removedOptimisticValidatorsPKs: string[],
) =>
  fetchedValidators.filter(
    (validator) =>
      !removedOptimisticValidatorsPKs.some(
        (pk) =>
          add0x(pk).toLowerCase() === add0x(validator.public_key).toLowerCase(),
      ),
  );

type CalculateRunwayParams = {
  balance: bigint;
  feesPerBlock: bigint;
  effectiveBalance: bigint;
  deltaBalance?: bigint;
  deltaEffectiveBalance?: bigint;
  liquidationThresholdBlocks: bigint;
  minimumLiquidationCollateral: bigint;
};

export const calculateRunway = ({
  balance,
  feesPerBlock,
  effectiveBalance,
  deltaBalance = 0n,
  deltaEffectiveBalance = 0n,
  liquidationThresholdBlocks,
  minimumLiquidationCollateral,
}: CalculateRunwayParams) => {
  const snapshotEB = effectiveBalance || globals.DEFAULT_EB_PER_VALIDATOR;
  const totalEB = effectiveBalance + deltaEffectiveBalance;
  const burnRateSnapshot =
    (feesPerBlock * effectiveBalanceToVUnits(snapshotEB)) /
    globals.VUNITS_PRECISION;
  const burnRateWithDelta =
    (feesPerBlock *
      effectiveBalanceToVUnits(totalEB || globals.DEFAULT_EB_PER_VALIDATOR)) /
    globals.VUNITS_PRECISION;

  const collateralSnapshot = bigintMax(
    burnRateSnapshot * liquidationThresholdBlocks,
    minimumLiquidationCollateral,
  );

  const collateralWithDelta = bigintMax(
    burnRateWithDelta * liquidationThresholdBlocks,
    minimumLiquidationCollateral,
  );

  const burnRatePerDaySnapshot =
    burnRateSnapshot * globals.BLOCKS_PER_DAY || 1n;
  const burnRatePerDayWithDelta =
    burnRateWithDelta * globals.BLOCKS_PER_DAY || 1n;

  const runwaySnapshot = bigintMax(
    (balance - collateralSnapshot) / burnRatePerDaySnapshot,
    0n,
  );

  const runwayWithDelta = bigintMax(
    (balance + deltaBalance - collateralWithDelta) / burnRatePerDayWithDelta,
    0n,
  );

  const deltaDays = (runwaySnapshot - runwayWithDelta) * -1n;

  return {
    runway: runwayWithDelta,
    runwayDisplay: `${numberFormatter.format(runwayWithDelta)} Days`,
    isAtRisk: runwayWithDelta < 30n,
    deltaDays,
    isIncreasing: deltaDays > 0n,
    isDecreasing: deltaDays < 0n,
    hasDelta: deltaDays !== 0n,
  };
};
