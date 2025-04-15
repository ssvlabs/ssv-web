import { Text } from "@/components/ui/text";
import { Stepper } from "@/components/ui/stepper";
import { formatDistance } from "date-fns";
import type { useStrategyAssetWithdrawalRequest } from "@/hooks/b-app/use-asset-withdrawal-request";

type WithdrawalRequest = ReturnType<typeof useStrategyAssetWithdrawalRequest>;

export const WithdrawalStepper = ({
  request,
}: {
  request: WithdrawalRequest;
}) => {
  const stepperIndex = !request.hasRequested
    ? 0
    : request.inPendingPeriod
      ? 1
      : 2;

  return (
    <Stepper
      stepIndex={stepperIndex}
      steps={[
        {
          label: "Request",
        },
        {
          label: "Pending",
          variant: request.inPendingPeriod ? "warning" : undefined,
          addon: request.inPendingPeriod && (
            <Text variant="caption-medium" className="text-orange-500">
              {formatDistance(request.periods.pending.end, Date.now())} left
            </Text>
          ),
        },
        {
          label: request.isExpired ? "Withdraw" : "Withdrawable",
          variant: request.isExpired
            ? "error"
            : request.inExecutionPeriod
              ? "withdrawable"
              : undefined,
          addon: request.inExecutionPeriod ? (
            <Text variant="caption-medium" className="text-orange-500">
              Expires in{" "}
              {formatDistance(request.periods.execution.end, Date.now(), {
                addSuffix: false,
              })}
            </Text>
          ) : request.isExpired ? (
            <Text variant="caption-medium" className="text-error-500">
              Expired
            </Text>
          ) : null,
        },
      ]}
    />
  );
};
