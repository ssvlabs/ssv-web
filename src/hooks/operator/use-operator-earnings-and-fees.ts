import { useGetOperatorEarnings } from "@/lib/contract-interactions/hooks/getter";
import { useGetOperatorEarningsSSV } from "@/lib/contract-interactions/hooks/getter";
import { useGetOperatorFee } from "@/lib/contract-interactions/hooks/getter";
import { useGetOperatorFeeSSV } from "@/lib/contract-interactions/hooks/getter";
import { combineQueryStatus, withUnavailable } from "@/lib/react-query";
import { getYearlyFee } from "@/lib/utils/operator";

export const useOperatorEarningsAndFees = (operatorId: bigint) => {
  const queryOptions = { retry: 2, networkMode: "always" } as const;

  const earningsEth = useGetOperatorEarnings({ id: operatorId }, queryOptions);
  const earningsSSV = useGetOperatorEarningsSSV(
    { id: operatorId },
    queryOptions,
  );

  const feeEth = useGetOperatorFee({ operatorId }, queryOptions);
  const feeSSV = useGetOperatorFeeSSV({ operatorId }, queryOptions);
  const yearlyFeeEth = getYearlyFee(feeEth.data ?? 0n);
  const yearlyFeeSSV = getYearlyFee(feeSSV.data ?? 0n);
  const balanceEth = earningsEth.data ?? 0n;
  const balanceSSV = earningsSSV.data ?? 0n;

  // `?? 0n` above is indistinguishable from an on-chain zero — gate on these.
  const earningsStatus = withUnavailable(
    combineQueryStatus(earningsEth, earningsSSV),
    [earningsEth, earningsSSV],
  );
  const feesStatus = withUnavailable(combineQueryStatus(feeEth, feeSSV), [
    feeEth,
    feeSSV,
  ]);

  return {
    earningsEth,
    earningsSSV,
    feeEth,
    feeSSV,
    yearlyFeeEth,
    yearlyFeeSSV,
    balanceEth,
    balanceSSV,
    earningsStatus,
    feesStatus,
  };
};
