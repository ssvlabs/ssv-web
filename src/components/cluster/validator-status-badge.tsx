import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import type { Validator } from "@/types/api";
import type { BadgeProps } from "@/components/ui/badge";
import { Badge, type BadgeVariants } from "@/components/ui/badge";

type ValidatorStatus = Validator["status"];

const variants: Record<ValidatorStatus, BadgeVariants["variant"]> = {
  active: "success",
  inactive: "error",
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
      variant={getBadgeVariant(status.toLowerCase())}
    >
      {status}
    </Badge>
  );
};

ValidatorStatusBadge.displayName = "ValidatorStatusBadge";
