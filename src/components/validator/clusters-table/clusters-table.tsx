import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import type { Cluster, Pagination as IPagination } from "@/types/api";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Pagination } from "@/components/ui/pagination";
import { ClustersTableRow } from "@/components/validator/clusters-table/clusters-table-row";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loading } from "@/components/ui/Loading";
import LogoIcon from "@/assets/images/logo-icon.svg?react";
import { links } from "@/config/links";
import type { OrderBy, Sort } from "@/api/cluster";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export type ClusterTableProps = {
  clusters: Cluster[];
  onClusterClick: (cluster: Cluster) => void;
  pagination: IPagination;
  orderBy?: `${OrderBy}:${Sort}`;
  onOrderByChange?: (orderBy: `${OrderBy}:${Sort}`) => void;
  isEmpty?: boolean;
  isLoading?: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof ClusterTableProps> &
    ClusterTableProps
>;

export const ClusterTable: FCProps = ({
  isLoading,
  clusters,
  onClusterClick,
  pagination,
  orderBy: orderByProp = "id:asc",
  onOrderByChange,
  className,
  isEmpty,
  ...props
}) => {
  const [orderBy, sort] = orderByProp.split(":") as [OrderBy, Sort];

  const handleSort = (field: OrderBy) => {
    if (!onOrderByChange) return;

    if (orderBy !== field) {
      onOrderByChange(`${field}:desc`);
      return;
    }

    if (sort === "desc") {
      onOrderByChange(`${field}:asc`);
      return;
    }

    if (field === "id") {
      onOrderByChange(`${field}:desc`);
      return;
    }

    onOrderByChange("id:asc");
  };

  const renderSortableHeader = (header: {
    type: OrderBy;
    title: ReactNode;
  }) => {
    const isActive = orderBy === header.type;

    return (
      <div
        className="cursor-pointer flex gap-1 justify-start items-center flex-nowrap text-nowrap font-normal"
        onClick={() => handleSort(header.type)}
      >
        {header.title}
        <div className="size-4 flex flex-col justify-center items-center gap-0">
          <FaAngleUp
            className={cn("p-0 size-4 mb-[-2px]", {
              "text-primary-500": isActive && sort === "asc",
              "text-gray-400": !isActive,
            })}
          />
          <FaAngleDown
            className={cn("p-0 size-4 mt-[-2px]", {
              "text-primary-500": isActive && sort === "desc",
              "text-gray-400": !isActive,
            })}
          />
        </div>
      </div>
    );
  };

  return (
    <div data-testid="dashboard-clusters-table" className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-t-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead data-testid="dashboard-clusters-table-header-cluster">
            <Tooltip
              asChild
              content={
                <>
                  Clusters represent a unique set of operators who operate your
                  validators and can be represented by ID or a name.{" "}
                  <Button
                    data-testid="dashboard-clusters-table-header-cluster-more-link"
                    as={Link}
                    to={links.MORE_ON_CLUSTERS}
                    target="_blank"
                    variant="link"
                  >
                    Read more on clusters
                  </Button>
                </>
              }
            >
              {renderSortableHeader({
                type: "name",
                title: (
                  <span className="flex gap-2 items-center">
                    <span>Cluster</span>
                    <FaCircleInfo className="size-3 text-gray-500" />
                  </span>
                ),
              })}
            </Tooltip>
          </TableHead>
          <TableHead data-testid="dashboard-clusters-table-header-operators">
            Operators
          </TableHead>
          <TableHead data-testid="dashboard-clusters-table-header-validators">
            {renderSortableHeader({
              type: "validatorCount",
              title: "Validators",
            })}
          </TableHead>
          <TableHead data-testid="dashboard-clusters-table-header-effective-balance">
            {renderSortableHeader({
              type: "effectiveBalance",
              title: "Total Effective Balance",
            })}
          </TableHead>
          <TableHead data-testid="dashboard-clusters-table-header-cluster-balance">
            Cluster Balance
          </TableHead>
          <TableHead data-testid="dashboard-clusters-table-header-operational-runway">
            Operational Runway
          </TableHead>
          <TableHead />
          <TableHead />
        </TableHeader>
        <TableBody>
          {clusters.map((cluster, index) => {
            return (
              <ClustersTableRow
                key={cluster.id}
                cluster={cluster}
                rowIndex={index}
                onClick={() => onClusterClick(cluster)}
              />
            );
          })}
        </TableBody>
      </Table>

      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
      {isEmpty ? (
        <div
          data-testid="dashboard-clusters-empty-state"
          className="flex flex-col items-center justify-center gap-4 w-full bg-gray-50 py-16 rounded-b-2xl"
        >
          <LogoIcon className="size-20" />
          <div className="flex flex-col items-center gap-2">
            <Text
              data-testid="dashboard-clusters-empty-message"
              variant="body-2-medium"
            >
              You don't have any clusters yet.
            </Text>
            <Button
              data-testid="dashboard-clusters-empty-create-btn"
              as={Link}
              to="/join/validator"
              size="lg"
              className="w-[120%]"
            >
              Create a cluster
            </Button>
          </div>
        </div>
      ) : pagination.pages > 1 ? (
        <>
          <Divider />
          <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl">
            <Pagination pagination={pagination} />
          </div>
        </>
      ) : (
        <div className="flex w-full bg-gray-50 py-4 rounded-b-2xl"></div>
      )}
    </div>
  );
};

ClusterTable.displayName = "ClusterTable";
