import { type FC, type ComponentPropsWithoutRef, useMemo } from "react";
import { cn } from "@/lib/utils/tw";
import type { IncreaseFeeStatus } from "@/hooks/operator/use-operator-fee-periods";
import {
  useOperatorDeclaredFee,
  useOperatorDeclaredFeeStatus,
  useOperatorIncreasedFeeCountDowns,
} from "@/hooks/operator/use-operator-fee-periods";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { format } from "date-fns";

const ignore: IncreaseFeeStatus["status"][] = ["declaration", "approved"];

export const IncreaseOperatorFeeStatusBadge: FC<
  ComponentPropsWithoutRef<"div">
> = ({ className, ...props }) => {
  const params = useOperatorPageParams();
  const operatorId = BigInt(params.operatorId!);

  const { status, isExpired } = useOperatorDeclaredFeeStatus(operatorId);

  const countDowns = useOperatorIncreasedFeeCountDowns(operatorId);
  const declaredFee = useOperatorDeclaredFee(operatorId);

  const title: Partial<Record<IncreaseFeeStatus["status"], string>> = useMemo(
    () => ({
      waiting: "Waiting period",
      "pending-execution": "Pending Execution",
      expired: "Expired",
    }),
    [],
  );

  if (ignore.includes(status)) return null;

  const renderContent = () => {
    switch (status) {
      case "waiting":
        return <Text variant="body-3-semibold">{countDowns.waiting}</Text>;
      case "pending-execution":
        return (
          <Text variant="body-3-semibold" className="text-error-500">
            {countDowns.pendingExecution}
          </Text>
        );
      case "expired":
        return (
          <Text variant="body-3-semibold">
            {format(declaredFee.data.approvalEndTimeMS, "dd MMM yyyy")}
          </Text>
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-end gap-1", className)} {...props}>
      <Badge size="sm" variant={isExpired ? "error" : "primary"}>
        {title[status]}
      </Badge>
      {renderContent()}
    </div>
  );
};

IncreaseOperatorFeeStatusBadge.displayName = "IncreaseOperatorFeeStatusBadge";
