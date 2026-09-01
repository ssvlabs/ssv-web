import { useGetOperatorEarnings } from "@/lib/contract-interactions/hooks/getter";
import { useGetOperatorEarningsSSV } from "@/lib/contract-interactions/hooks/getter";
import { useGetOperatorFee } from "@/lib/contract-interactions/hooks/getter";
import { useGetOperatorFeeSSV } from "@/lib/contract-interactions/hooks/getter";
import { combineQueryStatus } from "@/lib/react-query";
import { getYearlyFee } from "@/lib/utils/operator";

type FetchStatusOnly = { fetchStatus: "fetching" | "paused" | "idle" };

// A read that cannot reach the RPC parks at fetchStatus "paused" and never
// resolves to an error, so paused counts as unavailable too.
const withUnavailable = <T extends { isError: boolean; isPending: boolean }>(
  status: T,
  queries: FetchStatusOnly[],
) => {
  const isPaused = queries.some((query) => query.fetchStatus === "paused");
  return {
    ...status,
    isPaused,
    isUnavailable: status.isError || isPaused,
    isPending: status.isPending && !isPaused,
  };
};

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
