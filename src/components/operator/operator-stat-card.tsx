import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Card } from "@/components/ui/card";
import { OperatorDetails } from "@/components/operator/operator-details";
import type { OperatorID } from "@/types/types";
import { Spinner } from "@/components/ui/spinner";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { useOperatorState } from "@/hooks/operator/use-operator-state";
import { formatSSV, percentageFormatter } from "@/lib/utils/number";
import { CircleX } from "lucide-react";
import { OperatorStatusBadge } from "@/components/operator/operator-status-badge";

export type OperatorStatCardProps = {
  operatorId: OperatorID;
};

type OperatorStatCardFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorStatCardProps> &
    OperatorStatCardProps
>;

export const OperatorStatCard: OperatorStatCardFC = ({
  operatorId,
  className,
  ...props
}) => {
  const operatorState = useOperatorState(operatorId);

  if (operatorState.isLoading)
    return (
      <Card
        className={cn(
          className,
          "min-h-[180.8px] items-center justify-center  gap-2",
        )}
        {...props}
      >
        <Spinner />
        <Text variant="caption-semibold">
          Operator {operatorId.toString()}...
        </Text>
      </Card>
    );

  if (operatorState.isError || !operatorState.data)
    return (
      <Card
        className={cn(
          className,
          "min-h-[180.8px] flex flex-col items-center justify-center gap-2",
        )}
        {...props}
      >
        <CircleX className="text-error-500 size-6" />
        <Text variant="caption-semibold">
          Could not load operator {operatorId.toString()}
        </Text>
      </Card>
    );

  const { operator, fee } = operatorState.data;

  return (
    <Card
      variant={
        operatorState.data?.operator?.is_deleted ? "disabled" : "default"
      }
      className={cn("flex flex-col p-6 gap-4", className)}
      {...props}
    >
      <OperatorDetails operator={operator} />
      <Divider />
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <Tooltip content="Is the operator performing duties for the majority of its validators for the last 2 epochs.">
            <div className="flex items-center gap-2">
              <Text variant="caption-medium">Status</Text>
              <FaCircleInfo className="text-gray-400 size-3" />
            </div>
          </Tooltip>
          <OperatorStatusBadge size="sm" status={operator.status} />
        </div>
        <div className="flex flex-col gap-1">
          <Text variant="caption-medium">30D Perform.</Text>
          <Text variant="body-2-semibold">
            {percentageFormatter.format(operator.performance["30d"])}
          </Text>
        </div>
        <div className="flex flex-col justify-end gap-1 text-end">
          <Text variant="caption-medium">Yearly Fee</Text>
          <Text variant="body-2-semibold">{formatSSV(fee.yearly)} SSV</Text>
        </div>
      </div>
    </Card>
  );
};

OperatorStatCard.displayName = "OperatorStatCard";
