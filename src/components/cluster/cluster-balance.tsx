import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Span, Text } from "@/components/ui/text";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { formatSSV } from "@/lib/utils/number";
import { bigintAbs } from "@/lib/utils/bigint";

export type ClusterBalanceProps = {
  clusterHash?: string;
  deltaBalance?: bigint;
};

type EstimatedOperationalRunwayFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ClusterBalanceProps> &
    ClusterBalanceProps
>;

export const ClusterBalance: EstimatedOperationalRunwayFC = ({
  className,
  clusterHash,
  deltaBalance = 0n,
  ...props
}) => {
  const params = useClusterPageParams();
  const hash = clusterHash || params.clusterHash;

  const { data: clusterBalance = 0n } = useClusterBalance(hash!);
  const isWithdrawing = deltaBalance < 0n;

  return (
    <div className={cn(className, "flex flex-col gap-1")} {...props}>
      <Text variant="body-2-bold" className="text-gray-500">
        Cluster Balance
      </Text>
      <div className={cn("flex gap-1")}>
        <Text variant="headline4" className="font-bold ">
          {formatSSV(clusterBalance + deltaBalance)} SSV
          {deltaBalance !== 0n && (
            <Span
              variant="body-2-medium"
              className={cn("pl-1", {
                "text-error-500": deltaBalance < 0,
                "text-success-500": deltaBalance > 0,
              })}
            >
              ({isWithdrawing ? "-" : "+"}
              {formatSSV(bigintAbs(deltaBalance))} SSV)
            </Span>
          )}
        </Text>
      </div>
    </div>
  );
};

ClusterBalance.displayName = "EstimatedOperationalRunway";
