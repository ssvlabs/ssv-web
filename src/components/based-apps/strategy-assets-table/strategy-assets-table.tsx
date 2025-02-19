import type { FC, ComponentPropsWithoutRef } from "react";
import { TableHeader, TableHead, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { StrategyAssetsTableRow } from "@/components/based-apps/strategy-assets-table/strategy-assets-table-row.tsx";

export type AssetsTableProps = {
  assets: {
    token: `0x${string}`;
    totalDelegation: string;
    delegations: { bAppId: `0x${string}`; percentage: string }[];
    totalFiat: string;
    totalTokens: bigint;
  }[];
  searchValue?: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof AssetsTableProps> &
    AssetsTableProps
>;

export const StrategyAssetsTable: FCProps = ({
  assets,
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
        <TableHead>Asset</TableHead>
        <TableHead>Total Delegated</TableHead>
        <TableHead>Total Delegated Value</TableHead>
        <TableHead>Total Obligation</TableHead>
      </TableHeader>
      {assets.map((asset) => {
        return (
          <StrategyAssetsTableRow
            key={asset.token}
            searchValue={searchValue}
            asset={asset}
          />
        );
      })}
    </Table>
  );
};

StrategyAssetsTable.displayName = "StrategyAssetsTable";
