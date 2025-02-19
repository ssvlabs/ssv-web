import type { FC, ComponentPropsWithoutRef } from "react";
import { TableHeader, TableHead, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { StrategyBAppsTableRow } from "@/components/based-apps/strategy-b-apps-table/strategy-b-apps-table-row.tsx";
import type { StrategyBApp } from "@/api/b-app.ts";

export type BAppsTableProps = {
  bApps: StrategyBApp[];
  searchValue?: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof BAppsTableProps> &
    BAppsTableProps
>;

export const StrategyBAppsTable: FCProps = ({
  bApps,
  searchValue,
  className,
  ...props
}) => {
  return (
    <Table
      className={cn(className, "w-full rounded-t-xl overflow-hidden")}
      {...props}
    >
      <TableHeader>
        <TableHead>BApps</TableHead>
        <TableHead>Asset</TableHead>
      </TableHeader>
      {bApps.map((bApp) => {
        return <StrategyBAppsTableRow searchValue={searchValue} bApp={bApp} />;
      })}
    </Table>
  );
};

StrategyBAppsTable.displayName = "StrategyBAppsTable";
