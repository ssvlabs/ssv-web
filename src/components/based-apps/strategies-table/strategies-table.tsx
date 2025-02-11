import type { FC, ComponentPropsWithoutRef } from "react";
import type { Pagination as IPagination } from "@/types/api";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Pagination } from "@/components/ui/pagination-v2";
import { Divider } from "@/components/ui/divider";
import { StrategyTableRow } from "@/components/based-apps/strategies-table/strategy-table-row";

export type OperatorsTableProps = {
  strategies: {
    id: string;
    name: string;
    bApps: number;
    delegators: number;
    assets: string[];
    fee: string;
    totalDelegatedValue: number | bigint;
  }[];
  pagination: IPagination;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof OperatorsTableProps> &
    OperatorsTableProps
>;

export const StrategiesTable: FCProps = ({
  strategies,
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
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>BApps</TableHead>
          <TableHead>Supported Assets</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Delegators</TableHead>
          <TableHead>Delegated</TableHead>
        </TableHeader>
        <TableBody>
          {strategies.map((strategy) => {
            return <StrategyTableRow key={strategy.id} strategy={strategy} />;
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

StrategiesTable.displayName = "StrategiesTable";
