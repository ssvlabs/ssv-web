import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { OperatorDetails } from "@/components/operator/operator-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { Span } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useOptimisticOrProvidedOperator } from "@/hooks/operator/use-optimistic-operator";
import { useNativeCurrency } from "@/hooks/use-native-currency";
import { formatSSV } from "@/lib/utils/number";
import { shortenClusterId } from "@/lib/utils/strings";
import { cn } from "@/lib/utils/tw";
import type { Cluster } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link } from "react-router-dom";

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
  const nativeCurrency = useNativeCurrency();

  return (
    <TableRow
      key={cluster.id}
      className={cn("cursor-pointer", className, {
        "bg-warning-200": runway.data?.isAtRisk,
        "bg-error-50": isLiquidated,
      })}
      {...props}
    >
      <TableCell>{shortenClusterId(cluster.clusterId)}</TableCell>
      <TableCell>
        <div className="flex -space-x-[8px] ">
          {cluster.operators.map((o) => {
            const Cmp: FC = () => {
              const operator = useOptimisticOrProvidedOperator(o);
              return (
                <Tooltip
                  asChild
                  content={
                    <OperatorDetails
                      className="dark"
                      isShowExplorerLink={false}
                      operator={operator}
                    />
                  }
                >
                  <OperatorAvatar
                    src={operator.logo}
                    isPrivate={operator.is_private}
                    size="lg"
                    variant="circle"
                    className={cn(
                      "bg-white border border-gray-300 shadow p-[4px]",
                      {
                        "border-red-400 [&_img]:opacity-40 [&_svg]:opacity-40":
                          operator.is_deleted,
                      },
                    )}
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
        <div className="flex items-center gap-1">
          <img src="/images/networks/dark.svg" className="size-5" />{" "}
          <Span variant="body-2-medium">
            {cluster.validatorCount * 32} {nativeCurrency?.symbol}{" "}
          </Span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <img src="/images/ssvIcons/icon.svg" className="size-5" />{" "}
          <Span variant="body-2-medium">
            {" "}
            {formatSSV(BigInt(cluster.balance))} SSV
          </Span>
        </div>
      </TableCell>
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
      <TableCell>
        {apiCluster.data?.type === "ssv" && (
          <Button
            as={Link}
            to="/switch-wizard"
            onClick={(ev) => {
              ev.stopPropagation();
            }}
            variant="outline"
            colorScheme="primary"
            className="px-5"
            size="sm"
          >
            <Span variant="body-3-semibold" className="text-primary-500">
              Switch to {nativeCurrency?.symbol}
            </Span>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

ClustersTableRow.displayName = "ClustersTableRow";
