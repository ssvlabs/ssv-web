import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import type { BadgeProps, BadgeVariants } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import type { Operator } from "@/types/api";

type OperatorStatus = Operator["status"];
export type OperatorStatusBadgeProps = {
  status: OperatorStatus;
};

type OperatorStatusBadgeFC = FC<
  Omit<BadgeProps, keyof OperatorStatusBadgeProps> & OperatorStatusBadgeProps
>;

const variants: Record<OperatorStatus, BadgeVariants["variant"]> = {
  active: "success",
  removed: "uncoloredError",
  "no validators": "info",
};

const getBadgeVariant = (status: OperatorStatus) => {
  return variants[status] ?? "error";
};

export const OperatorStatusBadge: OperatorStatusBadgeFC = ({
  className,
  status,
  ...props
}) => {
  return (
    <Badge
      className={cn(className)}
      {...props}
      variant={getBadgeVariant(status.toLowerCase())}
    >
      {status}
    </Badge>
  );
};

OperatorStatusBadge.displayName = "OperatorStatusBadge";
