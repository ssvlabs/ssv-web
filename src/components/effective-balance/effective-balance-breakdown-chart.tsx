import { type FC, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { StripedBar } from "@/components/ui/striped-bar";
import { numberFormatter } from "@/lib/utils/number";
import { useClusterEffectiveBalanceBreakdown } from "@/hooks/cluster/use-cluster-effective-balance-breakdown";
import type { ValidatorsEffectiveBalanceByClusterResponse } from "@/api/validators";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";

export type EffectiveBalanceBreakDownChartProps = {
  clusterHash: string;
};

const MIN_BAR_WIDTH = 8;

type StatusVisualConfig = {
  key: keyof ValidatorsEffectiveBalanceByClusterResponse["effectiveBalance"];
  label: string;
  variant: React.ComponentProps<typeof StripedBar>["variant"];
  tooltip: string;
};

const STATUS_CONFIG: StatusVisualConfig[] = [
  {
    key: "notDeposited",
    label: "Not Deposited",
    variant: "notDeposited",
    tooltip:
      "Undeposited on the beacon chain. Minimum 32ETH effective balance applies per validator.",
  },
  {
    key: "pending",
    label: "Depositing",
    variant: "depositing",
    tooltip:
      "Effective balance of validators in the beacon chain activation queue. Minimum 32ETH effective balance applies per validator.",
  },
  {
    key: "deposited",
    label: "Deposited",
    variant: "active",
    tooltip:
      "Effective balance of validators with an active deposit on the beacon chain.",
  },
  {
    key: "exiting",
    label: "Exiting",
    variant: "exiting",
    tooltip:
      "Effective balance of validators that have requested an exit but haven't reached their exit epoch yet.",
  },
  {
    key: "exited",
    label: "Exited",
    variant: "exited",
    tooltip:
      "Validators that have fully exited the beacon chain. Minimum 32ETH effective balance applies per validator.",
  },
  {
    key: "slashed",
    label: "Slashed",
    variant: "slashed",
    tooltip:
      "Validators that have been slashed. Minimum 32ETH minimum effective balance applies per validator.",
  },
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
                <Tooltip asChild content={item.tooltip}>
                  <span>
                    <FaCircleInfo className="size-3 text-gray-400" />
                  </span>
                </Tooltip>
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
