import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { numberFormatter } from "@/lib/utils/number";
import { EffectiveBalanceBreakDownChart } from "./effective-balance-breakdown-chart";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";

type EffectiveBalanceBreakdownCardProps = {
  clusterHash: string;
  effectiveBalance: number;
  projectedEffectiveBalance: number;
  hasProjected: boolean;
  activeTab: "current" | "projected";
  onTabChange: (tab: "current" | "projected") => void;
};

export const EffectiveBalanceBreakdownCard: FC<
  EffectiveBalanceBreakdownCardProps
> = ({
  clusterHash,
  effectiveBalance,
  projectedEffectiveBalance,
  hasProjected,
  activeTab,
  onTabChange,
}) => {
  return (
    <Card className="w-full p-6 gap-6">
      <div className="flex items-center justify-between">
        <Tooltip
          asChild
          content="Current beacon-chain effective balance for this validator (ETH)"
        >
          <div className="flex items-center gap-1.5">
            <Text variant="headline4" className="text-gray-500">
              Effective Balance
            </Text>
            <FaCircleInfo className="size-4 text-gray-500" />
          </div>
        </Tooltip>
        {!hasProjected && (
          <Text variant="headline4">
            {numberFormatter.format(effectiveBalance)} ETH
          </Text>
        )}
      </div>
      {hasProjected && (
        <div className="flex flex-col gap-1 rounded-xl bg-gray-200 border border-gray-300 p-1">
          <Tooltip
            asChild
            content="Total effective balance of all deposited validators in this cluster, according to the oracles."
          >
            <button
              type="button"
              onClick={() => onTabChange("current")}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all",
                activeTab === "current" && "bg-gray-50 shadow-sm",
              )}
            >
              <Text
                variant="body-3-medium"
                className={
                  activeTab === "current" ? "text-gray-700" : "text-gray-600"
                }
              >
                Current
              </Text>
              <Text
                variant="headline4"
                className={
                  activeTab === "current" ? "text-gray-700" : "text-gray-600"
                }
              >
                {numberFormatter.format(effectiveBalance)} ETH
              </Text>
            </button>
          </Tooltip>
          <Tooltip
            asChild
            content="Total effective balance of all validators in this cluster, including validators waiting in the deposit queue or not yet picked up by the oracles."
          >
            <button
              type="button"
              onClick={() => onTabChange("projected")}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all",
                activeTab === "projected" && "bg-gray-50 shadow-sm",
              )}
            >
              <Text
                variant="body-3-medium"
                className={
                  activeTab === "projected" ? "text-gray-700" : "text-gray-600"
                }
              >
                Projected
              </Text>
              <Text variant="headline4" className="text-primary-500">
                {numberFormatter.format(projectedEffectiveBalance)} ETH
              </Text>
            </button>
          </Tooltip>
        </div>
      )}
      <EffectiveBalanceBreakDownChart clusterHash={clusterHash} />
    </Card>
  );
};

EffectiveBalanceBreakdownCard.displayName = "EffectiveBalanceBreakdownCard";
