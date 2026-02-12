import { computeFundingCost } from "@/lib/utils/keystore";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useNetworkFee } from "./use-ssv-network-fee";
import type { Operator } from "@/types/api";
import { stringifyBigints } from "@/lib/utils/bigint";
import { sumOperatorsFee } from "@/lib/utils/operator";

type Args = {
  operatorsFee: bigint;
  fundingDays: number;
  effectiveBalance: bigint;
};

export const useComputeFundingCost = () => {
  const {
    isSuccess,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useNetworkFee();

  return useMutation({
    mutationFn: async ({
      fundingDays,
      operatorsFee,
      effectiveBalance,
    }: Args) => {
      if (!isSuccess) {
        throw new Error("Something went wrong, please try again later.");
      }
      return computeFundingCost({
        operatorsFee,
        fundingDays,
        networkFee: ssvNetworkFee.data!,
        liquidationCollateralPeriod: liquidationThresholdPeriod.data!,
        minimumLiquidationCollateral: minimumLiquidationCollateral.data!,
        effectiveBalance,
      });
    },
  });
};

export type UseFundingCostArgs = {
  operators: Pick<Operator, "eth_fee" | "fee">[];
  fundingDays: number;
  effectiveBalance: bigint;
};

export const useFundingCost = ({
  operators,
  fundingDays,
  effectiveBalance,
}: UseFundingCostArgs) => {
  const {
    isSuccess,
    isLoading,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useNetworkFee();

  const costQuery = useQuery({
    staleTime: 0,
    gcTime: 0,
    queryKey: stringifyBigints([
      "fundingCost",
      operators,
      fundingDays,
      effectiveBalance,
    ]),
    queryFn: async () =>
      computeFundingCost({
        operatorsFee: sumOperatorsFee(operators),
        fundingDays,
        networkFee: ssvNetworkFee.data!,
        liquidationCollateralPeriod: liquidationThresholdPeriod.data!,
        minimumLiquidationCollateral: minimumLiquidationCollateral.data!,
        effectiveBalance,
      }),
    placeholderData: keepPreviousData,
    enabled: isSuccess,
  });
  return {
    ...costQuery,
    isLoading: costQuery.isLoading || isLoading,
  };
};
