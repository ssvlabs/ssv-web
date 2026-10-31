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
  operators: Operator[];
  fundingDays: number;
  /** Effective balance in ETH (human-readable). Examples: 32n (1 validator), 64n (2 validators) */
  effectiveBalance: bigint;
};

export const useFundingCostETH = ({
  operators,
  fundingDays,
  effectiveBalance,
}: UseFundingCostArgs) => {
  const {
    isSuccess,
    isPending: isNetworkPending,
    isUnavailable: isNetworkUnavailable,
    liquidationThresholdPeriod,
    minimumLiquidationCollateral,
    ssvNetworkFee,
  } = useNetworkFee();

  const costQuery = useQuery({
    staleTime: 0,
    gcTime: 0,
    queryKey: stringifyBigints([
      "fundingCost",
      operators.map((op) => ({
        id: op.id,
        eth_fee: op.eth_fee,
        is_deleted: op.is_deleted,
      })),
      fundingDays,
      effectiveBalance,
    ]),
    queryFn: async () =>
      computeFundingCost({
        operatorsFee: sumOperatorsFee(operators, "eth"),
        fundingDays,
        networkFee: ssvNetworkFee.data!,
        liquidationCollateralPeriod: liquidationThresholdPeriod.data!,
        minimumLiquidationCollateral: minimumLiquidationCollateral.data!,
        effectiveBalance,
      }),
    placeholderData: keepPreviousData,
    // Pure local computation: never park it at "paused" while offline.
    networkMode: "always",
    enabled: isSuccess,
  });
  // When the network params can't be read, costQuery stays disabled (and
  // pending) forever — surface that as unavailable instead of loading.
  const isUnavailable = isNetworkUnavailable || costQuery.isError;

  return {
    ...costQuery,
    isLoading: !isUnavailable && (isNetworkPending || costQuery.isLoading),
    isUnavailable,
  };
};
