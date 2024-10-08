import { globals } from "@/config";
import { useOperator } from "@/hooks/operator/use-operator";
import { useGetMaximumOperatorFee } from "@/lib/contract-interactions/read/use-get-maximum-operator-fee";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee";
import { useGetOperatorFeeIncreaseLimit } from "@/lib/contract-interactions/read/use-get-operator-fee-increase-limit";
import { bigintMin } from "@/lib/utils/bigint";
import { getYearlyFee } from "@/lib/utils/operator";

export const useOperatorFeeLimits = () => {
  const { data: operator } = useOperator();

  const { data: fee = 0n } = useGetOperatorFee(
    { operatorId: BigInt(operator!.id) },
    { enabled: !!operator },
  );

  const increaseLimit = useGetOperatorFeeIncreaseLimit({
    placeholderData: 0n,
  });

  const maxOperatorFee = useGetMaximumOperatorFee();
  const isLoading = increaseLimit.isLoading || maxOperatorFee.isLoading;

  const maxOperatorYearlyFee = getYearlyFee(BigInt(maxOperatorFee.data ?? 0));
  const operatorYearlyFee = getYearlyFee(fee);
  const maxIncrease =
    operatorYearlyFee +
    (operatorYearlyFee * (increaseLimit.data || 0n)) / 10000n;

  const max = bigintMin(maxIncrease, maxOperatorYearlyFee);
  const min = globals.BLOCKS_PER_YEAR * globals.MINIMUM_OPERATOR_FEE_PER_BLOCK;

  return {
    isLoading,
    max,
    min,
    increaseLimit: increaseLimit.data ?? 0n,
    maxOperatorFee: maxOperatorFee.data ?? 0n,
    maxOperatorYearlyFee,
    operatorYearlyFee,
    maxIncrease,
  };
};
