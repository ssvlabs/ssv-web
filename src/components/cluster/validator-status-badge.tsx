import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import type { BadgeProps } from "@/components/ui/badge";
import { Badge, type BadgeVariants } from "@/components/ui/badge";
import { ValidatorStatus } from "@/lib/utils/validator-status-mapping.ts";

const variants: Record<ValidatorStatus, BadgeVariants["variant"]> = {
  [ValidatorStatus.NOT_DEPOSITED]: "secondary",
  [ValidatorStatus.PENDING]: "warning",
  [ValidatorStatus.ACTIVE]: "success",
  [ValidatorStatus.INACTIVE]: "error",
  [ValidatorStatus.EXITING]: "primary",
  [ValidatorStatus.SLASHED]: "error",
  [ValidatorStatus.EXITED]: "purple",
  [ValidatorStatus.INVALID]: "warning",
};

export type ValidatorStatusBadgeProps = {
  status: ValidatorStatus;
};

const getBadgeVariant = (status: ValidatorStatus) => {
  return variants[status] ?? "error";
};

type ValidatorStatusBadgeFC = FC<
  Omit<BadgeProps, keyof ValidatorStatusBadgeProps> & ValidatorStatusBadgeProps
>;

export const ValidatorStatusBadge: ValidatorStatusBadgeFC = ({
  className,
  status,
  ...props
}) => {
  return (
    <Badge
      className={cn(className)}
      {...props}
      variant={getBadgeVariant(status)}
    >
      {status}
    </Badge>
  );
};

ValidatorStatusBadge.displayName = "ValidatorStatusBadge";
