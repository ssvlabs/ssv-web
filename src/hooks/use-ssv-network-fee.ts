import {
  useGetLiquidationThresholdPeriodSSV,
  useGetMinimumLiquidationCollateralSSV,
  useGetNetworkFeeSSV,
} from "@/lib/contract-interactions/hooks/getter";
import { useGetLiquidationThresholdPeriod } from "@/lib/contract-interactions/read/use-get-liquidation-threshold-period";
import { useGetMinimumLiquidationCollateral } from "@/lib/contract-interactions/read/use-get-minimum-liquidation-collateral";
import { useGetNetworkFee } from "@/lib/contract-interactions/read/use-get-network-fee";

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

  return {
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
    isSuccess: queries.every((query) => query.isSuccess),
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

  return {
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
    isSuccess: queries.every((query) => query.isSuccess),
    ssvNetworkFee,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
  };
};
