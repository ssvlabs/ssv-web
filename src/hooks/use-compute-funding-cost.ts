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
  effectiveBalance?: bigint;
};

export const useComputeFundingCost = () => {
  const {
    isSuccess,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useSsvNetworkFee();

  return useMutation({
    mutationFn: async ({ fundingDays, validators, operatorsFee, effectiveBalance }: Args) => {
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
        effectiveBalance,
      });
    },
  });
};

export type UseFundingCostArgs = {
  operators: Pick<Operator, "eth_fee">[];
  validatorsAmount: number;
  fundingDays: number;
  effectiveBalance?: bigint;
};

export const useFundingCost = ({
  operators,
  validatorsAmount,
  fundingDays,
  effectiveBalance,
}: UseFundingCostArgs) => {
  const {
    isSuccess,
    isLoading,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee ,
  } = useSsvNetworkFee();

  const costQuery = useQuery({
    staleTime: 0,
    gcTime: 0,
    queryKey: stringifyBigints([
      "fundingCost",
      operators,
      validatorsAmount,
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
        validators: BigInt(validatorsAmount || 1),
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
