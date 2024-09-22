import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { OperatorDetails } from "@/components/operator/operator-details";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useOptimisticOrProvidedOperator } from "@/hooks/operator/use-optimistic-operator";
import { shortenAddress } from "@/lib/utils/strings";
import { cn } from "@/lib/utils/tw";
import type { Cluster } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { HiArrowRight } from "react-icons/hi";

export type ClustersTableRowProps = {
  cluster: Cluster;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof ClustersTableRowProps> &
    ClustersTableRowProps
>;

export const ClustersTableRow: FCProps = ({ cluster, className, ...props }) => {
  const apiCluster = useCluster(cluster.clusterId);
  const runway = useClusterRunway(cluster.clusterId);
  const isLiquidated = apiCluster.data?.isLiquidated;
  const isLoadingRunway = !isLiquidated && runway.isLoading;

  return (
    <TableRow
      key={cluster.id}
      className={cn("cursor-pointer", className, {
        "bg-warning-200": runway.data?.isAtRisk,
        "bg-error-50": isLiquidated,
      })}
      {...props}
    >
      <TableCell>{shortenAddress(cluster.clusterId, 6)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-3">
          {cluster.operators.map((o) => {
            const Cmp: FC = () => {
              const operator = useOptimisticOrProvidedOperator(o);
              return (
                <Tooltip
                  asChild
                  content={
                    <OperatorDetails className="dark" operator={operator} />
                  }
                >
                  <OperatorAvatar
                    src={operator.logo}
                    isPrivate={operator.is_private}
                    size="md"
                    variant="circle"
                  />
                </Tooltip>
              );
            };

            return <Cmp key={o.id} />;
          })}
        </div>
      </TableCell>
      <TableCell>{cluster.validatorCount}</TableCell>
      <TableCell>
        {isLoadingRunway ? (
          <Skeleton className="h-5 w-14" />
        ) : (
          runway.data?.runwayDisplay
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {isLiquidated ? (
          <Badge size="sm" variant="error">
            Liquidated
          </Badge>
        ) : isLoadingRunway ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <>
            {runway.data?.isAtRisk && (
              <Badge size="sm" variant="warning">
                Low runway
              </Badge>
            )}
          </>
        )}
      </TableCell>
      <TableCell className="">
        <HiArrowRight className="size-4 text-gray-500" />
      </TableCell>
    </TableRow>
  );
};

ClustersTableRow.displayName = "ClustersTableRow";
