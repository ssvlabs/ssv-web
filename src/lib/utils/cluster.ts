import { globals } from "@/config";
import { bigintMax, stringifyBigints } from "@/lib/utils/bigint";
import { numberFormatter, sortNumbers } from "@/lib/utils/number";
import { add0x } from "@/lib/utils/strings";
import type {
  Cluster,
  Operator,
  SolidityCluster,
  Validator,
} from "@/types/api";
import type { Address } from "abitype";
import { isNumber, merge } from "lodash-es";
import { encodePacked, keccak256, parseUnits } from "viem";

export const createClusterHash = (
  account: Address,
  operators: readonly (Pick<Operator, "id"> | number)[],
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
  cluster?: Partial<Cluster<{ operators: number[] }>> | null,
): SolidityCluster => ({
  active: cluster?.active ?? true,
  balance: cluster?.migrated
    ? BigInt(cluster?.ethBalance ?? 0)
    : BigInt(cluster?.balance ?? 0),
  index: BigInt(cluster?.index ?? 0),
  networkFeeIndex: BigInt(cluster?.networkFeeIndex ?? 0),
  validatorCount: cluster?.validatorCount ?? 0,
});

export const toSolidityClusterSnapshot = (
  cluster?: Partial<Cluster<{ operators: number[] }>> | null,
) => ({
  clusterOwner: cluster?.ownerAddress ?? "",
  cluster: toSolidityCluster(cluster),
  operatorIds: cluster?.operators?.map((id) => BigInt(id)) ?? [],
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
  validators: number;
  deltaBalance?: bigint;
  deltaValidators?: number;
  liquidationThresholdBlocks: bigint;
  minimumLiquidationCollateral: bigint;
};

const VALIDATOR_DECIMALS = 6;
const VALIDATOR_SCALE = 10n ** BigInt(VALIDATOR_DECIMALS);

const toScaledValidators = (value: number): bigint => {
  if (!Number.isFinite(value)) return 0n;
  const normalized = value > 0 ? value : 0;
  return parseUnits(normalized.toFixed(VALIDATOR_DECIMALS), VALIDATOR_DECIMALS);
};

export const calculateRunway = ({
  balance,
  feesPerBlock,
  validators,
  deltaBalance = 0n,
  deltaValidators = 0,
  liquidationThresholdBlocks,
  minimumLiquidationCollateral,
}: CalculateRunwayParams) => {
  const validatorsSnapshot = validators > 0 ? validators : 1;
  const validatorsWithDelta = validators + deltaValidators;

  const burnRateSnapshotScaled =
    feesPerBlock * toScaledValidators(validatorsSnapshot);
  const burnRateWithDeltaScaled =
    feesPerBlock * toScaledValidators(validatorsWithDelta);

  const collateralSnapshotScaled = bigintMax(
    burnRateSnapshotScaled * liquidationThresholdBlocks,
    minimumLiquidationCollateral * VALIDATOR_SCALE,
  );

  const collateralWithDeltaScaled = bigintMax(
    burnRateWithDeltaScaled * liquidationThresholdBlocks,
    minimumLiquidationCollateral * VALIDATOR_SCALE,
  );

  const burnRatePerDaySnapshotScaled =
    burnRateSnapshotScaled * globals.BLOCKS_PER_DAY || 1n;
  const burnRatePerDayWithDeltaScaled =
    burnRateWithDeltaScaled * globals.BLOCKS_PER_DAY || 1n;

  const runwaySnapshot = bigintMax(
    (balance * VALIDATOR_SCALE - collateralSnapshotScaled) /
      burnRatePerDaySnapshotScaled,
    0n,
  );

  const runwayWithDelta = bigintMax(
    ((balance + deltaBalance) * VALIDATOR_SCALE - collateralWithDeltaScaled) /
      burnRatePerDayWithDeltaScaled,
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
