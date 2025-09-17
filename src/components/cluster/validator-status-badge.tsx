import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import type { Validator } from "@/types/api";
import type { BadgeProps } from "@/components/ui/badge";
import { Badge, type BadgeVariants } from "@/components/ui/badge";
import { VALIDATOR_STATUS } from "@/lib/utils/validator-status-mapping.ts";

type ValidatorStatus = Validator["displayedStatus"];

const variants: Record<ValidatorStatus, BadgeVariants["variant"]> = {
  [VALIDATOR_STATUS.NOT_DEPOSITED]: "secondary",
  [VALIDATOR_STATUS.PENDING]: "warning",
  [VALIDATOR_STATUS.ACTIVE]: "success",
  [VALIDATOR_STATUS.INACTIVE]: "error",
  [VALIDATOR_STATUS.EXITING]: "primary",
  [VALIDATOR_STATUS.SLASHED]: "error",
  [VALIDATOR_STATUS.EXITED]: "purple",
  [VALIDATOR_STATUS.INVALID]: "warning",
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
