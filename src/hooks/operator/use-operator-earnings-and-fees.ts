import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { useGetOperatorEarningsSSV } from "@/lib/contract-interactions/read/use-get-operator-earnings-ssv";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee";
import { useGetOperatorFeeSSV } from "@/lib/contract-interactions/read/use-get-operator-fee-ssv";
import { getYearlyFee } from "@/lib/utils/operator";

export const useOperatorEarningsAndFees = (operatorId: bigint) => {
  const earningsEth = useGetOperatorEarnings({ id: operatorId });
  const earningsSSV = useGetOperatorEarningsSSV({ id: operatorId });

  const feeEth = useGetOperatorFee({ operatorId });
  const feeSSV = useGetOperatorFeeSSV({ operatorId });
  const yearlyFeeEth = getYearlyFee(feeEth.data ?? 0n);
  const yearlyFeeSSV = getYearlyFee(feeSSV.data ?? 0n);
  const balanceEth = earningsEth.data ?? 0n;
  const balanceSSV = earningsSSV.data ?? 0n;

  return {
    earningsEth,
    earningsSSV,
    feeEth,
    feeSSV,
    yearlyFeeEth,
    yearlyFeeSSV,
    balanceEth,
    balanceSSV,
  };
};
