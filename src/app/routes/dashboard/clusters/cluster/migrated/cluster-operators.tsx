import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import type { Operator } from "@/types/api";

export type ClusterOperatorsProps = {
  operators: Operator[];
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
              className={cn(
                "text-[9px] leading-[14px] font-medium text-center w-[26px]",
                op.is_active >= 1 ? "text-gray-500" : "text-error-500",
              )}
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
  const isActive = operator.is_active >= 1;
  return (
    <div
      className={cn(
        "rounded-[6px] border overflow-clip size-[26px] flex items-center bg-gray-200",
        {
          "border-success-500": isActive,
          "border-error-500": !isActive,
        },
      )}
    >
      <OperatorAvatar
        src={operator.logo}
        size="xs"
        variant="square"
        className="size-full rounded-none"
      />
    </div>
  );
};
