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
import { formatOperatorETHFee, percentageFormatter } from "@/lib/utils/number";
import { CircleX } from "lucide-react";
import { OperatorStatusBadge } from "@/components/operator/operator-status-badge";
import { FaEthereum } from "react-icons/fa";

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
      <div className="grid grid-cols-[1fr_auto_auto] gap-1 gap-x-3 items-center">
        <Tooltip content="Is the operator performing duties for the majority of its validators for the last 2 epochs.">
          <div className="flex items-center justify-start gap-1">
            <Text variant="caption-medium" className="text-gray-500">
              Status
            </Text>
            <FaCircleInfo className="text-gray-400 size-3" />
          </div>
        </Tooltip>
        <Tooltip content="Operator performance calculated by the percentage of attended duties over the last 30 days.">
          <div className="flex items-center justify-end gap-1">
            <Text variant="caption-medium" className="text-gray-500">
              30D
            </Text>
            <FaCircleInfo className="text-gray-400 size-3" />
          </div>
        </Tooltip>
        <Tooltip content="Annualized fee in SSV.">
          <div className="flex items-center justify-end gap-1">
            <Text variant="caption-medium" className="text-gray-500">
              1Y Fee
            </Text>
            <FaCircleInfo className="text-gray-400 size-3" />
          </div>
        </Tooltip>
        <div className="flex justify-start">
          <OperatorStatusBadge size="xs" status={operator.status} />
        </div>
        <Text variant="body-3-medium" className="text-gray-800 text-right">
          {percentageFormatter.format(operator.performance["30d"])}
        </Text>
        <div className="flex items-center justify-end gap-0.5">
          <FaEthereum className="size-3 text-gray-600" />
          <Text variant="body-3-medium" className="text-gray-800">
            {formatOperatorETHFee(fee.yearly)} {/* ETH */}
          </Text>
        </div>
      </div>
    </Card>
  );
};

OperatorStatCard.displayName = "OperatorStatCard";
