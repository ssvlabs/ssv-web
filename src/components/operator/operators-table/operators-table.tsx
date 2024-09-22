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

export type OperatorsTableProps = {
  operators: Operator[];
  onOperatorClick: (operator: Operator) => void;
  pagination: IPagination;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof OperatorsTableProps> &
    OperatorsTableProps
>;

export const OperatorsTable: FCProps = ({
  operators,
  onOperatorClick,
  pagination,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-t-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead>Operator name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>30D Performance</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Yearly Fee</TableHead>
          <TableHead>Validators</TableHead>
          <TableHead />
        </TableHeader>
        <TableBody>
          {operators.map((operator) => {
            const { queryKey } = getOperatorQueryOptions(operator.id);
            const cachedOperator = queryClient.getQueryData(queryKey);
            if (cachedOperator?.is_deleted) return null;

            return (
              <OperatorTableRow
                key={operator.id}
                operator={operator}
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
