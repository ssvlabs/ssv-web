import { useUpdateOperatorFeeContext } from "@/guard/register-operator-guards";
import { useOperator } from "@/hooks/operator/use-operator";
import { useGetOperatorDeclaredFee } from "@/lib/contract-interactions/read/use-get-operator-declared-fee";
import { useGetOperatorFeePeriods } from "@/lib/contract-interactions/read/use-get-operator-fee-periods";
import { queryClient } from "@/lib/react-query";
import { humanizeDuration } from "@/lib/utils/date";
import { useInterval, useUpdate } from "react-use";

export const useOperatorFeePeriods = () => {
  const [declareOperatorFeePeriod, executeOperatorFeePeriod] =
    useGetOperatorFeePeriods().data ?? [0n, 0n];

  return {
    declareOperatorFeePeriod,
    executeOperatorFeePeriod,
  };
};

const defaultDeclaredFee = [false, 0n, 0n, 0n] as const;

export const useOperatorDeclaredFee = (operatorId: bigint) => {
  const context = useUpdateOperatorFeeContext();

  const query = useGetOperatorDeclaredFee(
    { operatorId },
    {
      refetchOnWindowFocus: false,
      enabled: !context.newYearlyFee,
    },
  );

  const { declareOperatorFeePeriod } = useOperatorFeePeriods();

  const [
    hasRequestedFeeChange,
    requestedFee,
    approvalBeginTime,
    approvalEndTime,
  ] = query.data || defaultDeclaredFee;

  const declarationDateMS = hasRequestedFeeChange
    ? Number(approvalBeginTime - declareOperatorFeePeriod) * 1000
    : Date.now();

  return {
    ...query,
    data: {
      declarationDateMS: declarationDateMS,
      hasRequestedFeeChange,
      requestedFee,
      approvalBeginTimeMS: Number(approvalBeginTime * 1000n),
      approvalEndTimeMS: Number(approvalEndTime * 1000n),
    },
    reset: () => queryClient.setQueryData(query.queryKey, defaultDeclaredFee),
  };
};

export type IncreaseFeeStatus = {
  isDeclaration: boolean;
  isWaiting: boolean;
  isPendingExecution: boolean;
  isApproved: boolean;
  isExpired: boolean;
  status:
    | "declaration"
    | "waiting"
    | "pending-execution"
    | "expired"
    | "approved";
};
const createStatus = (
  status: Partial<IncreaseFeeStatus> & Pick<IncreaseFeeStatus, "status"> = {
    status: "declaration",
  },
): IncreaseFeeStatus => ({
  isDeclaration: false,
  isWaiting: false,
  isPendingExecution: false,
  isApproved: false,
  isExpired: false,
  ...status,
});

export const useOperatorDeclaredFeeStatus = (operatorId: bigint) => {
  const operator = useOperator(String(operatorId));
  const { data } = useOperatorDeclaredFee(operatorId);

  const update = useUpdate();
  useInterval(update, data.hasRequestedFeeChange ? 1000 : null);

  const now = Date.now();
  const isApproved = BigInt(operator.data?.fee ?? 0) === data.requestedFee;

  if (!data.hasRequestedFeeChange)
    return createStatus({
      isDeclaration: true,
      status: "declaration",
    });
  if (now < data.approvalBeginTimeMS)
    return createStatus({
      isWaiting: true,
      status: "waiting",
    });
  if (isApproved)
    return createStatus({
      isApproved: true,
      status: "approved",
    });
  if (now < data.approvalEndTimeMS)
    return createStatus({
      isPendingExecution: true,
      status: "pending-execution",
    });

  return createStatus({
    isExpired: true,
    status: "expired",
  });
};

export const useOperatorIncreasedFeeCountDowns = (operatorId: bigint) => {
  const status = useOperatorDeclaredFeeStatus(operatorId);
  const declaredFee = useOperatorDeclaredFee(operatorId);

  return {
    waiting: status.isWaiting
      ? humanizeDuration(declaredFee.data.approvalBeginTimeMS - Date.now())
      : "",
    pendingExecution: status.isPendingExecution
      ? humanizeDuration(declaredFee.data.approvalEndTimeMS - Date.now())
      : "",
  };
};
