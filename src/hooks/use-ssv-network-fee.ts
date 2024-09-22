import { useGetLiquidationThresholdPeriod } from "@/lib/contract-interactions/read/use-get-liquidation-threshold-period";
import { useGetMinimumLiquidationCollateral } from "@/lib/contract-interactions/read/use-get-minimum-liquidation-collateral";
import { useGetNetworkFee } from "@/lib/contract-interactions/read/use-get-network-fee";

export const useSsvNetworkFee = () => {
  const ssvNetworkFee = useGetNetworkFee();
  const liquidationThresholdPeriod = useGetLiquidationThresholdPeriod();
  const minimumLiquidationCollateral = useGetMinimumLiquidationCollateral();

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
