import { computeFundingCost } from "@/lib/utils/keystore";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useSsvNetworkFee } from "./use-ssv-network-fee";
import type { Operator } from "@/types/api";
import { stringifyBigints } from "@/lib/utils/bigint";
import { sumOperatorsFee } from "@/lib/utils/operator";

type Args = {
  operatorsFee: bigint;
  validators: number;
  fundingDays: number;
};

export const useComputeFundingCost = () => {
  const {
    isSuccess,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useSsvNetworkFee();

  return useMutation({
    mutationFn: async ({ fundingDays, validators, operatorsFee }: Args) => {
      if (!isSuccess) {
        throw new Error("Something went wrong, please try again later.");
      }
      return computeFundingCost({
        operatorsFee,
        fundingDays,
        networkFee: ssvNetworkFee.data!,
        liquidationCollateralPeriod: liquidationThresholdPeriod.data!,
        minimumLiquidationCollateral: minimumLiquidationCollateral.data!,
        validators: BigInt(validators || 1),
      });
    },
  });
};

export type UseFundingCostArgs = {
  operators: Pick<Operator, "fee">[];
  validatorsAmount: number;
  fundingDays: number;
};

export const useFundingCost = ({
  operators,
  validatorsAmount,
  fundingDays,
}: UseFundingCostArgs) => {
  const {
    isSuccess,
    isLoading,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useSsvNetworkFee();

  const costQuery = useQuery({
    staleTime: 0,
    gcTime: 0,
    queryKey: stringifyBigints([
      "fundingCost",
      operators,
      validatorsAmount,
      fundingDays,
    ]),
    queryFn: async () =>
      computeFundingCost({
        operatorsFee: sumOperatorsFee(operators),
        fundingDays,
        networkFee: ssvNetworkFee.data!,
        liquidationCollateralPeriod: liquidationThresholdPeriod.data!,
        minimumLiquidationCollateral: minimumLiquidationCollateral.data!,
        validators: BigInt(validatorsAmount || 1),
      }),
    placeholderData: keepPreviousData,
    enabled: isSuccess,
  });
  return {
    ...costQuery,
    isLoading: costQuery.isLoading || isLoading,
  };
};
