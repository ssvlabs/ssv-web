import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Span, Text } from "@/components/ui/text";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { EstimatedOperationalRunwayAlert } from "@/components/cluster/estimated-operational-runway-alert";
import { bigintAbs } from "@/lib/utils/bigint";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { humanizeFundingDuration } from "@/lib/utils/date";
import { ms } from "@/lib/utils/number";

export type EstimatedOperationalRunwayProps = {
  clusterHash?: string;
  deltaBalance?: bigint;
  deltaValidators?: bigint;
  withAlerts?: boolean;
};

type EstimatedOperationalRunwayFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof EstimatedOperationalRunwayProps> &
    EstimatedOperationalRunwayProps
>;

export const EstimatedOperationalRunway: EstimatedOperationalRunwayFC = ({
  className,
  clusterHash,
  deltaValidators = 0n,
  deltaBalance = 0n,
  withAlerts = true,
  ...props
}) => {
  const params = useClusterPageParams();
  const hash = clusterHash || params.clusterHash;

  const { isLiquidated } = useClusterState(hash!);

  const { data: clusterRunway } = useClusterRunway(hash!, {
    deltaBalance,
    deltaValidators,
    watch: true,
  });

  return (
    <div className={cn(className, "flex flex-col gap-4")} {...props}>
      <div className={cn(className, "flex flex-col gap-1")}>
        <Tooltip
          asChild
          content="Estimated amount of days the cluster balance is sufficient to run all it's validators."
        >
          <div className="flex gap-2 w-fit items-center text-gray-500">
            <Text variant="body-2-bold">Est. Operational Runway</Text>
            <FaCircleInfo className="size-3 text-gray-500" />
          </div>
        </Tooltip>
        <div
          className={cn("flex items-end gap-1", {
            "text-error-500": clusterRunway?.isAtRisk,
          })}
        >
          <Text variant="headline4">
            {clusterRunway?.runway === 0n
              ? "0"
              : humanizeFundingDuration(
                  ms(Number(clusterRunway?.runway ?? 0), "days"),
                )}
          </Text>
          {clusterRunway?.hasDelta && (
            <Span
              className={cn({
                "text-error-500": clusterRunway.isDecreasing,
                "text-success-500": clusterRunway.isIncreasing,
              })}
            >
              ({clusterRunway.isDecreasing ? "-" : "+"}
              {bigintAbs(clusterRunway.deltaDays).toString()} days)
            </Span>
          )}
        </div>
      </div>
      {withAlerts && (
        <EstimatedOperationalRunwayAlert
          isLiquidated={isLiquidated.data ?? false}
          hasDeltaValidators={deltaValidators !== 0n}
          isAtRisk={clusterRunway?.isAtRisk ?? false}
          runway={clusterRunway?.runway ?? 0n}
          isWithdrawing={clusterRunway?.isDecreasing && !deltaValidators}
        />
      )}
    </div>
  );
};

EstimatedOperationalRunway.displayName = "EstimatedOperationalRunway";
