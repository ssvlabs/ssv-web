import type { FC, ComponentPropsWithoutRef } from "react";
import type { Pagination as IPagination, Cluster } from "@/types/api";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
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
import { TbLayoutGridAdd } from "react-icons/tb";
import { Loading } from "@/components/ui/Loading";

export type ClusterTableProps = {
  clusters: Cluster[];
  onClusterClick: (cluster: Cluster) => void;
  pagination: IPagination;
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
  className,
  isEmpty,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-t-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead>
            <Tooltip
              asChild
              content={
                <>
                  Clusters represent a unique set of operators who operate your
                  validators.{" "}
                  <Button
                    as={Link}
                    to="https://docs.ssv.network/learn/stakers/clusters"
                    target="_blank"
                    variant="link"
                  >
                    Read more on clusters
                  </Button>
                </>
              }
            >
              <div className="flex gap-2 items-center">
                <Text>Cluster ID</Text>
                <FaCircleInfo className="size-3 text-gray-500" />
              </div>
            </Tooltip>
          </TableHead>
          <TableHead>Operators</TableHead>
          <TableHead>Validators</TableHead>
          <TableHead>Est Operational Runway</TableHead>
          <TableHead />
          <TableHead />
        </TableHeader>
        <TableBody>
          {clusters.map((cluster) => {
            return (
              <ClustersTableRow
                key={cluster.id}
                cluster={cluster}
                onClick={() => onClusterClick(cluster)}
              />
            );
          })}
        </TableBody>
      </Table>

      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 w-full bg-gray-50 py-16 rounded-b-2xl">
          <TbLayoutGridAdd
            strokeWidth="1.7"
            className="size-12 text-primary-500"
          />
          <div className="flex flex-col items-center gap-2">
            <Text variant="body-2-medium">
              You don't have any clusters yet.
            </Text>
            <Button
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
