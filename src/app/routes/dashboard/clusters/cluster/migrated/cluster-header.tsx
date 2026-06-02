import type { FC, ComponentPropsWithoutRef } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { CopyBtn } from "@/components/ui/copy-btn";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useIsClusterLiquidated } from "@/hooks/cluster/use-is-cluster-liquidated";
import { shortenClusterId } from "@/lib/utils/strings";
import { FaAngleLeft } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ClusterOperators } from "./cluster-operators";
import { Tooltip } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { OperatorsBreakdownChart } from "@/components/cluster/operators-breakdown-chart";
import { useOperators } from "@/hooks/operator/use-operators";
import { ClusterNameDialog } from "./cluster-name-dialog";
import { useAccount } from "@/hooks/account/use-account";

export const ClusterHeader: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { clusterHash } = useClusterPageParams();
  const cluster = useCluster(clusterHash!);
  const isLiquidated = useIsClusterLiquidated(clusterHash!, { watch: true });

  const { data: operators = [] } = useOperators(cluster.data?.operators ?? []);

  const clusterId = cluster.data?.clusterId ?? "";
  const clusterName = cluster.data?.name;
  const isLiquidatedCluster = Boolean(isLiquidated.data);

  const { address } = useAccount();
  const isOwner =
    address?.toLowerCase() === cluster.data?.ownerAddress?.toLowerCase();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card
      data-testid="dashboard-migrated-cluster-header"
      className={cn("flex flex-row items-center gap-3 p-6 w-full", className)}
      {...props}
    >
      <Link
        data-testid="dashboard-migrated-cluster-header-back-link"
        to="/clusters"
        className="flex items-center justify-center rounded-[6px] bg-gray-100 p-1.5"
      >
        <FaAngleLeft className="size-4 text-primary-500" />
      </Link>

      <div className="flex flex-1 items-center gap-5 min-w-0">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <Text
            data-testid="dashboard-migrated-cluster-header-name"
            variant="headline4"
            className="truncate"
          >
            {clusterName || "Cluster"}
          </Text>
          {isOwner && (
            <button
              data-testid="dashboard-migrated-cluster-header-edit-name-btn"
              onClick={() => setIsDialogOpen(true)}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaPencil className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 h-6">
          <div className="flex items-center gap-1 rounded-[6px] bg-gray-100 border border-gray-200 px-2 py-0.5">
            <Text variant="caption-medium" className="text-gray-500">
              ID:
            </Text>
            <Text
              data-testid="dashboard-migrated-cluster-header-id"
              variant="body-3-medium"
              className="font-robotoMono text-gray-700"
            >
              {shortenClusterId(clusterId)}
            </Text>
            <CopyBtn
              data-testid="dashboard-migrated-cluster-header-id-copy-btn"
              text={clusterId}
            />
          </div>

          {isLiquidatedCluster && (
            <Badge
              data-testid="dashboard-migrated-cluster-header-liquidated-badge"
              variant="error"
              size="xs"
            >
              Liquidated
            </Badge>
          )}
        </div>

        <div className="ml-auto shrink-0">
          <Tooltip
            className="p-6"
            content={<OperatorsBreakdownChart operators={operators} />}
          >
            <ClusterOperators operators={operators} />
          </Tooltip>
        </div>
      </div>
      <ClusterNameDialog
        clusterId={clusterId}
        currentName={clusterName}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
};

ClusterHeader.displayName = "ClusterHeader";
