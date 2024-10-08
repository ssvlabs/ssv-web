import { globals } from "@/config";
import { useSsvNetworkFee } from "@/hooks/use-ssv-network-fee";
import { bigintMax } from "@/lib/utils/bigint";
import { numberFormatter } from "@/lib/utils/number";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { serialize } from "@wagmi/core";

type Params = {
  balance: bigint;
  burnRate: bigint;
  validators?: bigint;
  deltaBalance?: bigint;
  deltaValidators?: bigint;
};

export const useRunway = ({
  balance,
  burnRate: _burnRate,
  validators = 1n,
  deltaBalance = 0n,
  deltaValidators = 0n,
}: Params) => {
  const {
    liquidationThresholdPeriod: { data: liquidationThresholdBlocks = 0n },
    minimumLiquidationCollateral: { data: minimumLiquidationCollateral = 0n },
    isLoading,
    isSuccess,
  } = useSsvNetworkFee();

  const query = useQuery({
    queryKey: [
      "calculate-runway",
      balance,
      _burnRate,
      validators,
      deltaBalance,
      deltaValidators,
      liquidationThresholdBlocks,
      minimumLiquidationCollateral,
    ].map((v) => serialize(v)),
    queryFn: async () => {
      const burnRateSnapshot = _burnRate * (validators || 1n);
      const burnRateWithDelta = _burnRate * (validators + deltaValidators);

      const collateralSnapshot = bigintMax(
        burnRateSnapshot * liquidationThresholdBlocks,
        minimumLiquidationCollateral,
      );

      const collateralWithDelta = bigintMax(
        burnRateWithDelta * liquidationThresholdBlocks,
        minimumLiquidationCollateral,
      );

      const burnRatePerDaySnapshot = burnRateSnapshot * globals.BLOCKS_PER_DAY;
      const burnRatePerDayWithDelta =
        burnRateWithDelta * globals.BLOCKS_PER_DAY;

      const runwaySnapshot = bigintMax(
        (balance - collateralSnapshot) / burnRatePerDaySnapshot,
        0n,
      );

      const runwayWithDelta = bigintMax(
        (balance + deltaBalance - collateralWithDelta) /
          burnRatePerDayWithDelta,
        0n,
      );

      const deltaDays = (runwaySnapshot - runwayWithDelta) * -1n;

      return {
        runway: runwayWithDelta,
        runwayDisplay: `${numberFormatter.format(runwayWithDelta)} days`,
        isAtRisk: runwayWithDelta < 30n,
        deltaDays: deltaDays,
        isIncreasing: deltaDays > 0n,
        isDecreasing: deltaDays < 0,
        hasDelta: deltaDays !== 0n,
      };
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(_burnRate && isSuccess),
  });
  return {
    ...query,
    isLoading: query.isLoading || isLoading,
  };
};
