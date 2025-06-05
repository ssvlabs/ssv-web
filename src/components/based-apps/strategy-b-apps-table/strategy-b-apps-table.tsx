import type { FC, ComponentPropsWithoutRef } from "react";
import { TableHeader, TableHead, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { StrategyBAppsTableRow } from "@/components/based-apps/strategy-b-apps-table/strategy-b-apps-table-row.tsx";
import type { BAppsMetaData, StrategyBApp } from "@/api/b-app.ts";
import { Text } from "@/components/ui/text.tsx";
import { OptInBtn } from "@/app/routes/dashboard/b-app/strategies/opt-in/opt-in-btn.tsx";

export type BAppsTableProps = {
  bApps: (StrategyBApp & BAppsMetaData)[];
  searchValue?: string;
  strategyId?: string;
  isLoading?: boolean;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof BAppsTableProps> &
    BAppsTableProps
>;

export const StrategyBAppsTable: FCProps = ({
  bApps,
  searchValue,
  isLoading,
  strategyId,
  className,
  ...props
}) => {
  return (
    <div>
      <Table
        className={cn(
          className,
          `w-full rounded-t-xl overflow-hidden  ${!(!bApps.length && !isLoading) && "rounded-b-[16px]"}`,
        )}
        {...props}
      >
        <TableHeader>
          <TableHead>bApps</TableHead>
          <TableHead className="text-right">Asset</TableHead>
        </TableHeader>
        {bApps.map((bApp) => {
          return (
            <StrategyBAppsTableRow
              searchValue={searchValue}
              bApp={bApp}
              strategyId={strategyId}
            />
          );
        })}
      </Table>
      {!bApps.length && !isLoading && (
        <div className="bg-gray-50 w-full h-[200px] flex flex-col items-center gap-4 justify-center rounded-b-[16px]">
          <Text variant="body-3-medium">
            This strategy has not yet opted-in to a bApp
          </Text>
          <OptInBtn variant={"default"} />
        </div>
      )}
    </div>
  );
};

StrategyBAppsTable.displayName = "StrategyBAppsTable";
