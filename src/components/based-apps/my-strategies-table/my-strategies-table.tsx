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
import type {
  AccountMetadata,
  Strategy,
  StrategyMetadata,
} from "@/api/b-app.ts";
import { Loading } from "@/components/ui/Loading.tsx";
import { MyStrategyTableRow } from "@/components/based-apps/my-strategies-table/my-strategy-table-row.tsx";

export type OperatorsTableProps = {
  strategies: (Strategy &
    StrategyMetadata & { ownerAddressMetadata: AccountMetadata })[];
  pagination?: IPagination;
  isLoading?: boolean;
  showDepositButtonOnHover?: boolean;
  onDepositClick?: (strategy: Strategy) => void;
  onRowClick?: (strategy: Strategy) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof OperatorsTableProps> &
    OperatorsTableProps
>;

export const MyStrategiesTable: FCProps = ({
  strategies,
  pagination,
  className,
  isLoading,
  showDepositButtonOnHover,
  onDepositClick,
  onRowClick,
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
          <TableHead>Fee</TableHead>
          <TableHead>bApps</TableHead>
          <TableHead>Depositors</TableHead>
          <TableHead>Deposited Assets</TableHead>
          <TableHead>Total Deposited Value</TableHead>
        </TableHeader>
        <TableBody>
          {strategies?.map((strategy) => {
            return (
              <MyStrategyTableRow
                onDepositClick={onDepositClick}
                onRowClick={onRowClick}
                showDepositButtonOnHover={showDepositButtonOnHover}
                key={strategy.id}
                strategy={strategy}
              />
            );
          })}
        </TableBody>
      </Table>
      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
      {pagination && pagination.total > 10 ? (
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

MyStrategiesTable.displayName = "StrategiesTable";
