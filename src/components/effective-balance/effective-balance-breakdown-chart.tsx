import { type FC, type ComponentPropsWithoutRef, useState } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { numberFormatter } from "@/lib/utils/number";
import { useClusterEffectiveBalanceBreakdown } from "@/hooks/cluster/use-cluster-effective-balance-breakdown";

export type EffectiveBalanceBreakDownChartProps = {
  clusterHash: string;
};

const MIN_BAR_WIDTH = 8;

type EffectiveBalanceBreakDownChartFC = FC<
  Omit<
    ComponentPropsWithoutRef<"div">,
    keyof EffectiveBalanceBreakDownChartProps
  > &
    EffectiveBalanceBreakDownChartProps
>;

export const EffectiveBalanceBreakDownChart: EffectiveBalanceBreakDownChartFC =
  ({ className, clusterHash, ...props }) => {
    const { data: items = [] } =
      useClusterEffectiveBalanceBreakdown(clusterHash);

    const visibleItems = items.filter((item) => item.amount > 0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex h-2 gap-px">
          {visibleItems.map((item, index) => {
            const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
            return (
              <div
                key={index}
                className={cn("rounded-[2px] transition-all", {
                  "opacity-20": isDimmed,
                })}
                style={{
                  backgroundColor: item.color,
                  flexGrow: item.amount,
                  flexShrink: 0,
                  flexBasis: 0,
                  minWidth: `${MIN_BAR_WIDTH}px`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1">
          {visibleItems.map((item, index) => {
            const isInvalid = item.label === "Invalid";
            const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-1 rounded bg-gray-100 border border-gray-200 px-1.5 py-0.5 transition-opacity cursor-default",
                  { "opacity-50": isDimmed },
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="size-2 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
                <Text
                  variant="caption-medium"
                  className={cn(isInvalid ? "text-error-200" : "text-gray-500")}
                >
                  {item.label}
                </Text>
                <Text
                  variant="caption-bold"
                  className={cn(isInvalid ? "text-error-500" : "text-gray-700")}
                >
                  {numberFormatter.format(item.amount)} ETH
                </Text>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

EffectiveBalanceBreakDownChart.displayName = "EffectiveBalanceBreakDownChart";
