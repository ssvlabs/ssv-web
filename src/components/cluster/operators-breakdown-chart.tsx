import { useMemo, type FC, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { StripedBar } from "@/components/ui/striped-bar";
import { ClusterOperators } from "@/app/routes/dashboard/clusters/cluster/migrated/cluster-operators";
import type { Operator } from "@/types/api";
import { chunk } from "lodash-es";

export type OperatorsBreakdownChartProps = {
  operators: Operator[];
};

const getFaultTolerance = (clusterSize: number) =>
  Math.floor((clusterSize - 1) / 3);

type OperatorsBreakdownChartFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof OperatorsBreakdownChartProps> &
    OperatorsBreakdownChartProps
>;

export const OperatorsBreakdownChart: OperatorsBreakdownChartFC = ({
  className,
  operators,
  ...props
}) => {
  const total = operators.length;
  const activeCount = operators.filter((op) => op.is_active >= 1).length;
  const inactiveCount = total - activeCount;
  const threshold = getFaultTolerance(total);

  const [leftBars, rightBars] = useMemo(
    () =>
      chunk(
        [
          ...Array.from({ length: activeCount }, () => true),
          ...Array.from({ length: inactiveCount }, () => false),
        ],
        total - threshold,
      ),
    [activeCount, inactiveCount, total, threshold],
  );

  return (
    <div
      className={cn("flex flex-col gap-6 items-center", className)}
      {...props}
    >
      <ClusterOperators operators={operators} className="items-center" />

      <div className="flex gap-px w-fit">
        <div className="flex flex-col gap-1 pt-2 pr-1.5 pb-1 flex-1">
          <div className="flex gap-0.5">
            {leftBars.map((isActive, i) => (
              <StripedBar
                key={i}
                variant={isActive ? "active" : "inactive"}
                className="h-2 w-[29px]"
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Text variant="caption-medium" className="text-gray-500">
              Active
            </Text>
            <span className="text-xs font-bold leading-5">
              <span
                className={cn({
                  "text-error-500": inactiveCount > threshold,
                  "text-warning-500": inactiveCount === threshold,
                  "text-success-500": inactiveCount < threshold,
                })}
              >
                {activeCount}
              </span>
              <span className="text-gray-500">{" / "}</span>
              <span className="text-gray-700">{total}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-gray-100 border border-[rgba(236,28,38,0.12)] rounded pt-2 px-2 pb-1 items-end">
          <div className="flex gap-0.5 w-full">
            {rightBars.map((isActive, i) => (
              <StripedBar
                key={i}
                variant={isActive ? "active" : "inactive"}
                className="h-2 w-[29px]"
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Text variant="caption-medium" className="text-gray-500">
              Threshold
            </Text>
            <Text variant="caption-bold">{threshold}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

OperatorsBreakdownChart.displayName = "OperatorsBreakdownChart";
