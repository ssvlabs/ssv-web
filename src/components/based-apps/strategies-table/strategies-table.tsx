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
import type {
  AccountMetadata,
  Strategy,
  StrategyMetadata,
} from "@/api/b-app.ts";
import { Loading } from "@/components/ui/Loading.tsx";
import { Text } from "@/components/ui/text";

export type OperatorsTableProps = {
  strategies: (Strategy &
    StrategyMetadata & { ownerAddressMetadata: AccountMetadata })[];
  pagination?: IPagination;
  isLoading?: boolean;
  showDepositButtonOnHover?: boolean;
  onDepositClick?: (strategy: Strategy) => void;
  onRowClick?: (strategy: Strategy) => void;
  emptyState?: React.ReactNode;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof OperatorsTableProps> &
    OperatorsTableProps
>;

export const StrategiesTable: FCProps = ({
  strategies,
  pagination,
  className,
  isLoading,
  showDepositButtonOnHover,
  emptyState,
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
          <TableHead>Owner</TableHead>
          <TableHead>bApps</TableHead>
          <TableHead>Supported Assets</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Depositors</TableHead>
          <TableHead>Delegators</TableHead>
          <TableHead>Total Asset Value</TableHead>
        </TableHeader>
        <TableBody>
          {strategies?.map((strategy) => {
            return (
              <StrategyTableRow
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
      <div className="bg-gray-50 w-full">
        {isLoading && !strategies.length && <Loading />}
        {!isLoading && !strategies.length && (
          <div className="flex flex-col items-center h-[168px] pt-4 justify-center w-full py-4">
            {emptyState || (
              <>
                <Text variant="body-3-medium" className="text-gray-600">
                  No strategies found
                </Text>
              </>
            )}
          </div>
        )}
      </div>
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

StrategiesTable.displayName = "StrategiesTable";
