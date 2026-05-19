import type { FC, ComponentPropsWithoutRef } from "react";
import type { Operator, Pagination as IPagination } from "@/types/api";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Pagination } from "@/components/ui/pagination";
import { OperatorTableRow } from "@/components/operator/operators-table/operator-table-row";
import { queryClient } from "@/lib/react-query";
import { getOperatorQueryOptions } from "@/hooks/operator/use-operator";
import { Divider } from "@/components/ui/divider";
import type { OrderBy, Sort } from "@/api/operator";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export type OperatorsTableProps = {
  operators: Operator[];
  onOperatorClick: (operator: Operator) => void;
  pagination: IPagination;
  orderBy?: `${OrderBy}:${Sort}`;
  onOrderByChange?: (orderBy: `${OrderBy}:${Sort}`) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof OperatorsTableProps> &
    OperatorsTableProps
>;

export const OperatorsTable: FCProps = ({
  operators,
  onOperatorClick,
  pagination,
  orderBy: orderByProp = "id:asc",
  onOrderByChange,
  className,
  ...props
}) => {
  const [orderBy, sort] = orderByProp.split(":") as [OrderBy, Sort];

  const handleSort = (field: OrderBy) => {
    if (!onOrderByChange) return;

    if (orderBy !== field) {
      onOrderByChange(`${field}:desc`);
    } else if (sort === "desc") {
      onOrderByChange(`${field}:asc`);
    } else {
      onOrderByChange("id:asc");
    }
  };

  const renderSortableHeader = (header: { type: OrderBy; title: string }) => {
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
    <div
      data-testid="dashboard-operators-table"
      className="flex flex-col w-full"
    >
      <Table
        className={cn(className, "w-full rounded-t-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead data-testid="dashboard-operators-table-header-name">
            Operator name
          </TableHead>
          <TableHead data-testid="dashboard-operators-table-header-status">
            Status
          </TableHead>
          <TableHead data-testid="dashboard-operators-table-header-performance">
            {renderSortableHeader({
              type: "performance30d",
              title: "30D Performance",
            })}
          </TableHead>
          <TableHead data-testid="dashboard-operators-table-header-balance">
            Balance (ETH | SSV)
          </TableHead>
          <TableHead data-testid="dashboard-operators-table-header-yearly-fee">
            Yearly Fee (ETH | SSV)
          </TableHead>
          <TableHead data-testid="dashboard-operators-table-header-validators">
            {renderSortableHeader({
              type: "validatorsCount",
              title: "Validators",
            })}
          </TableHead>
          <TableHead data-testid="dashboard-operators-table-header-effective-balance">
            {renderSortableHeader({
              type: "effectiveBalance",
              title: "Total ETH Managed",
            })}
          </TableHead>
        </TableHeader>
        <TableBody>
          {operators.map((operator, index) => {
            const { queryKey } = getOperatorQueryOptions(operator.id);
            const cachedOperator = queryClient.getQueryData(queryKey);
            if (cachedOperator?.is_deleted) return null;

            return (
              <OperatorTableRow
                key={operator.id}
                operator={operator}
                rowIndex={index}
                onClick={() => {
                  return onOperatorClick(operator);
                }}
              />
            );
          })}
        </TableBody>
      </Table>
      {pagination.pages > 1 ? (
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

OperatorsTable.displayName = "OperatorsTable";
