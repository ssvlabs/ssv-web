import { useOperator } from "@/hooks/operator/use-operator.ts";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee.ts";
import { getYearlyFee } from "@/lib/utils/operator.ts";
import type { OperatorID } from "@/types/types.ts";
import { combineQueryStatus } from "@/lib/react-query";
import { useMemo } from "react";
import { computeDailyAmount } from "@/lib/utils/keystore";

export const useOperatorState = (operatorId: OperatorID) => {
  const operator = useOperator(operatorId);

  const operatorFee = useGetOperatorFee(
    { operatorId: BigInt(operatorId) },
    { enabled: !operator.data?.is_deleted },
  );

  const data = useMemo(() => {
    if (!operator.data) return undefined;
    const fee = operatorFee.data ?? 0n;
    return {
      operator: operator.data,
      fee: {
        block: fee,
        daily: computeDailyAmount(fee, 1),
        yearly: getYearlyFee(fee),
      },
    };
  }, [operator.data, operatorFee.data]);

  const combinedStatuses = combineQueryStatus(operator, operatorFee);

  return {
    data,
    ...combinedStatuses,
  };
};
