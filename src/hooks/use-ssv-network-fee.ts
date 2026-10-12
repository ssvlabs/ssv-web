import {
  useGetLiquidationThresholdPeriod,
  useGetLiquidationThresholdPeriodSSV,
  useGetMinimumLiquidationCollateral,
  useGetMinimumLiquidationCollateralSSV,
  useGetNetworkFee,
  useGetNetworkFeeSSV,
} from "@/lib/contract-interactions/hooks/getter";
import {
  combineQueryStatus,
  useRefetchWhileUnavailable,
  withUnavailable,
} from "@/lib/react-query";

export const useNetworkFee = (enabled: boolean = true) => {
  const ssvNetworkFee = useGetNetworkFee({ enabled });
  const liquidationThresholdPeriod = useGetLiquidationThresholdPeriod({
    enabled,
  });
  const minimumLiquidationCollateral = useGetMinimumLiquidationCollateral({
    enabled,
  });

  const queries = [
    ssvNetworkFee,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
  ];

  const status = withUnavailable(combineQueryStatus(...queries), queries);
  useRefetchWhileUnavailable(queries, enabled && status.isUnavailable);

  return {
    // isLoading / isError / isSuccess as before, plus isPending / isPaused /
    // isUnavailable / isIdle (all reads disabled) from withUnavailable.
    ...status,
    ssvNetworkFee,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
  };
};

export const useNetworkFeeSSV = (enabled: boolean = true) => {
  const ssvNetworkFee = useGetNetworkFeeSSV({ enabled });
  const liquidationThresholdPeriod = useGetLiquidationThresholdPeriodSSV({
    enabled,
  });
  const minimumLiquidationCollateral = useGetMinimumLiquidationCollateralSSV({
    enabled,
  });

  const queries = [
    ssvNetworkFee,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
  ];

  const status = withUnavailable(combineQueryStatus(...queries), queries);
  useRefetchWhileUnavailable(queries, enabled && status.isUnavailable);

  return {
    // isLoading / isError / isSuccess as before, plus isPending / isPaused /
    // isUnavailable / isIdle (all reads disabled) from withUnavailable.
    ...status,
    ssvNetworkFee,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
  };
};
