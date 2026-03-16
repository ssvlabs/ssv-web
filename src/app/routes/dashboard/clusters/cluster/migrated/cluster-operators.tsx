import type { FC, ComponentPropsWithoutRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/tw";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import type { Operator } from "@/types/api";

export type ClusterOperatorsProps = {
  operators: Operator[];
};

const operatorStatusVariants = cva(
  "rounded-[6px] border overflow-clip size-[26px] flex items-center bg-gray-200",
  {
    variants: {
      status: {
        active: "border-success-500",
        inactive: "border-error-500",
        "pending validators": "border-gray-500",
        "no validators": "border-gray-500",
        removed: "border-error-500",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  },
);

const operatorLabelVariants = cva(
  "text-[9px] leading-[14px] font-medium text-center w-[26px]",
  {
    variants: {
      status: {
        active: "text-gray-500",
        inactive: "text-error-500",
        "pending validators": "text-gray-500",
        "no validators": "text-gray-500",
        removed: "text-error-500",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  },
);

type StatusKey =
  | "active"
  | "inactive"
  | "pending validators"
  | "no validators"
  | "removed";

const STATUS_KEYS = new Set<StatusKey>([
  "active",
  "inactive",
  "pending validators",
  "no validators",
  "removed",
]);

const getStatusKey = (status: string): StatusKey => {
  const key = status.toLowerCase();
  return STATUS_KEYS.has(key as StatusKey) ? (key as StatusKey) : "inactive";
};

type ClusterOperatorsFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ClusterOperatorsProps> &
    ClusterOperatorsProps
>;

export const ClusterOperators: ClusterOperatorsFC = ({
  className,
  operators,
  ...props
}) => {
  if (!operators) return null;

  return (
    <div
      className={cn("flex flex-col gap-0.5 items-end", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {operators.map((op) => (
          <div key={op.id} className="flex flex-col gap-0.5 items-center">
            <OperatorItem operator={op} />
            <p
              className={operatorLabelVariants({
                status: getStatusKey(op.status),
              })}
            >
              {op.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

ClusterOperators.displayName = "ClusterOperators";

const OperatorItem: FC<{ operator: Operator }> = ({ operator }) => {
  const statusKey = getStatusKey(operator.status);
  return (
    <div className={operatorStatusVariants({ status: statusKey })}>
      <OperatorAvatar
        src={operator.logo}
        size="xs"
        variant="square"
        className="size-full rounded-none"
      />
    </div>
  );
};
