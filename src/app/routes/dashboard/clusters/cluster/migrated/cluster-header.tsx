import type { FC, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { CopyBtn } from "@/components/ui/copy-btn";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { shortenClusterId } from "@/lib/utils/strings";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ClusterOperators } from "./cluster-operators";
import { Tooltip } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { OperatorsBreakdownChart } from "@/components/cluster/operators-breakdown-chart";
import { useOperators } from "@/hooks/operator/use-operators";

export const ClusterHeader: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { clusterHash } = useClusterPageParams();
  const { cluster, isLiquidated } = useClusterState(clusterHash!, {
    isLiquidated: { watch: true },
  });

  const { data: operators = [] } = useOperators(cluster.data?.operators ?? []);

  const clusterId = cluster.data?.clusterId ?? "";
  const isLiquidatedCluster = Boolean(isLiquidated.data);

  return (
    <Card
      className={cn("flex flex-row items-center gap-3 p-6 w-full", className)}
      {...props}
    >
      <Link
        to="/clusters"
        className="flex items-center justify-center rounded-[6px] bg-gray-100 p-1.5"
      >
        <FaAngleLeft className="size-4 text-primary-500" />
      </Link>

      <div className="flex flex-1 items-center gap-5">
        <div className="flex items-center gap-2">
          <Text variant="headline4">Cluster</Text>
        </div>

        <div className="flex flex-1 items-center gap-2.5">
          <div className="flex flex-1 items-center gap-1 h-6">
            <div className="flex items-center gap-1 rounded-[6px] bg-gray-100 border border-gray-200 px-2 py-0.5">
              <Text variant="caption-medium" className="text-gray-500">
                ID:
              </Text>
              <Text
                variant="body-3-medium"
                className="font-robotoMono text-gray-700"
              >
                {shortenClusterId(clusterId)}
              </Text>
              <CopyBtn text={clusterId} />
            </div>

            {isLiquidatedCluster && (
              <Badge variant="error" size="xs">
                Liquidated
              </Badge>
            )}
          </div>

          <Tooltip
            className="p-6"
            content={<OperatorsBreakdownChart operators={operators} />}
          >
            <ClusterOperators operators={operators} />
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

ClusterHeader.displayName = "ClusterHeader";
