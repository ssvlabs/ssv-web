import { type FC, type ComponentPropsWithoutRef, useMemo } from "react";
import { cn } from "@/lib/utils/tw";
import { Stepper } from "@/components/ui/stepper";
import {
  useOperatorDeclaredFee,
  useOperatorDeclaredFeeStatus,
  useOperatorIncreasedFeeCountDowns,
} from "@/hooks/operator/use-operator-fee-periods";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { Text } from "@/components/ui/text";

export type IncreaseOperatorFeeStepperProps = {
  isCanceled?: boolean;
  operatorId?: bigint;
};

type IncreaseOperatorFeeStepperFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof IncreaseOperatorFeeStepperProps> &
    IncreaseOperatorFeeStepperProps
>;

export const IncreaseOperatorFeeStepper: IncreaseOperatorFeeStepperFC = ({
  className,
  operatorId,
  isCanceled,
  ...props
}) => {
  const params = useOperatorPageParams();
  const id = operatorId ?? BigInt(params.operatorId!);

  const status = useOperatorDeclaredFeeStatus(id);

  const step = useMemo(() => {
    if (status.isApproved || status.isExpired || isCanceled) return 4;
    if (status.isDeclaration) return 0;
    if (status.isWaiting) return 1;
    if (status.isPendingExecution) return 2;
    return 0;
  }, [status, isCanceled]);

  const countDowns = useOperatorIncreasedFeeCountDowns(id);
  const declaredFee = useOperatorDeclaredFee(id);

  return (
    <Stepper
      stepIndex={step}
      steps={[
        {
          label: "Declared Fee",
          addon: (
            <Text className="text-xs font-bold">
              {new Date(declaredFee.data.declarationDateMS).toLocaleString(
                "en-US",
                {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "numeric",
                },
              )}
            </Text>
          ),
        },
        {
          variant: status.isWaiting && isCanceled ? "error" : undefined,
          label: "Waiting period",
          addon: status.isWaiting && !isCanceled && (
            <Text className="text-xs font-bold text-primary-500">
              {countDowns.waiting}
            </Text>
          ),
        },
        {
          variant: isCanceled || status.isExpired ? "error" : undefined,
          label: "Pending execution",
          addon: status.isPendingExecution && !isCanceled && (
            <Text className="text-xs font-bold text-error-500">
              Expires in {countDowns.pendingExecution}
            </Text>
          ),
        },
        {
          variant: isCanceled || status.isExpired ? "error" : undefined,
          label: "Fee updated",
        },
      ]}
      className={cn(className)}
      {...props}
    />
  );
};

IncreaseOperatorFeeStepper.displayName = "IncreaseOperatorFeeStepper";
