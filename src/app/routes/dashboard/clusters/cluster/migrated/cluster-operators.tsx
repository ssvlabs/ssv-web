import type { FC, ComponentPropsWithoutRef } from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils/tw";
import { chunk } from "lodash-es";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { useOperators } from "@/hooks/operator/use-operators";
import type { Operator } from "@/types/api";

export type ClusterOperatorsProps = {
  operatorIds: number[];
};

const getFaultTolerance = (clusterSize: number) =>
  Math.floor((clusterSize - 1) / 3);

type ClusterOperatorsFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ClusterOperatorsProps> &
    ClusterOperatorsProps
>;

export const ClusterOperators: ClusterOperatorsFC = ({
  className,
  operatorIds,
  ...props
}) => {
  const { data: operators } = useOperators(operatorIds);
  console.log("operators:", operators);

  const [left, right] = useMemo(() => {
    if (!operators) return [[] as Operator[], [] as Operator[]];

    const safeCount = operators.length - getFaultTolerance(operators.length);

    const sorted = [...operators].sort((a, b) => {
      const aActive = a.status === "Active" ? 0 : 1;
      const bActive = b.status === "Active" ? 0 : 1;
      return aActive - bActive || a.id - b.id;
    });

    const [safeGroup, faultyGroup] = chunk(sorted, safeCount) as [
      Operator[],
      Operator[],
    ];

    return [safeGroup, faultyGroup ?? []];
  }, [operators]);

  if (!operators) return null;

  return (
    <div
      className={cn("flex flex-col gap-0.5 items-end", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {left.map((op) => (
          <OperatorItem key={op.id} operator={op} />
        ))}
        <div className="flex items-center self-stretch px-0.5">
          <div className="h-[90%] w-px border-l border-gray-500" />
        </div>
        {right.map((op) => (
          <OperatorItem key={op.id} operator={op} />
        ))}
      </div>
      <div className="flex items-center gap-1">
        {left.map((op) => (
          <OperatorId key={op.id} id={op.id} />
        ))}
        <div className="flex items-center self-stretch px-0.5">
          <div className="h-[90%] w-px border-l border-gray-500 opacity-10" />
        </div>
        {right.map((op) => (
          <OperatorId key={op.id} id={op.id} />
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
        "rounded-[6px] border overflow-clip size-[26px] flex items-center",
        {
          "border-success-500 bg-gray-200/50": isActive,
          "border-error-500 bg-error-200": !isActive,
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

const OperatorId: FC<{ id: number }> = ({ id }) => (
  <p className="text-[9px] leading-[14px] font-medium text-gray-500 text-center w-[26px]">
    {id}
  </p>
);
