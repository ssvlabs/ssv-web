import { type FC, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { StripedBar } from "@/components/ui/striped-bar";
import { numberFormatter } from "@/lib/utils/number";
import { useClusterEffectiveBalanceBreakdown } from "@/hooks/cluster/use-cluster-effective-balance-breakdown";
import type { ValidatorsEffectiveBalanceByClusterResponse } from "@/api/validators";

export type EffectiveBalanceBreakDownChartProps = {
  clusterHash: string;
};

const MIN_BAR_WIDTH = 8;

type StatusVisualConfig = {
  key: keyof ValidatorsEffectiveBalanceByClusterResponse["effectiveBalance"];
  label: string;
  variant: React.ComponentProps<typeof StripedBar>["variant"];
};

const STATUS_CONFIG: StatusVisualConfig[] = [
  { key: "notDeposited", label: "Not Deposited", variant: "notDeposited" },
  { key: "pending", label: "Depositing", variant: "depositing" },
  { key: "deposited", label: "Deposited", variant: "active" },
  { key: "exiting", label: "Exiting", variant: "exiting" },
  { key: "exited", label: "Exited", variant: "exited" },
  { key: "slashed", label: "Slashed", variant: "slashed" },
];

type EffectiveBalanceBreakDownChartFC = FC<
  Omit<
    ComponentPropsWithoutRef<"div">,
    keyof EffectiveBalanceBreakDownChartProps
  > &
    EffectiveBalanceBreakDownChartProps
>;

export const EffectiveBalanceBreakDownChart: EffectiveBalanceBreakDownChartFC =
  ({ className, clusterHash, ...props }) => {
    const { data: counts } = useClusterEffectiveBalanceBreakdown(clusterHash);

    const visibleItems = STATUS_CONFIG.map((config) => ({
      ...config,
      amount: counts?.[config.key] ?? 0,
    })).filter((item) => item.amount > 0);

    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex h-2 gap-px">
          {visibleItems.map((item) => (
            <StripedBar
              key={item.key}
              variant={item.variant}
              className="h-2 flex-1"
              style={{
                flexGrow: item.amount,
                flexShrink: 0,
                flexBasis: 0,
                minWidth: `${MIN_BAR_WIDTH}px`,
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {visibleItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <StripedBar variant={item.variant} className="size-2" />
                <Text variant="caption-medium" className="text-gray-500">
                  {item.label}
                </Text>
              </div>
              <Text variant="caption-bold">
                {numberFormatter.format(item.amount)} ETH
              </Text>
            </div>
          ))}
        </div>
      </div>
    );
  };

EffectiveBalanceBreakDownChart.displayName = "EffectiveBalanceBreakDownChart";
