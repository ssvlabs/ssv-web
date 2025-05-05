import type { FC, ComponentPropsWithoutRef } from "react";
import { TableHeader, TableHead, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { StrategyAssetsTableRow } from "@/components/based-apps/strategy-assets-table/strategy-assets-table-row.tsx";
import type { BAppAsset } from "@/api/b-app.ts";

export type AssetsTableProps = {
  assets: BAppAsset[];
  searchValue?: string;
  showDepositButtonOnHover?: boolean;
  onDepositClick?: (asset: AssetsTableProps["assets"][0]) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof AssetsTableProps> &
    AssetsTableProps
>;

export const StrategyAssetsTable: FCProps = ({
  assets,
  searchValue,
  className,
  showDepositButtonOnHover,
  onDepositClick,
  ...props
}) => {
  return (
    <Table
      className={cn(
        className,
        "w-full rounded-t-xl overflow-hidden  rounded-b-[16px]",
      )}
      {...props}
    >
      <TableHeader>
        <TableHead className="w-[28%]">Depositable Asset</TableHead>
        <TableHead className="w-[17%]">Total Deposited</TableHead>
        <TableHead className="w-[18%]">Total Deposited Value</TableHead>
        <TableHead className="w-[15%]">Total Obligation</TableHead>
      </TableHeader>
      {assets.map((asset) => {
        return (
          <StrategyAssetsTableRow
            key={asset.token}
            searchValue={searchValue}
            asset={asset}
            showDepositButtonOnHover={showDepositButtonOnHover}
            onDepositClick={() => onDepositClick?.(asset)}
          />
        );
      })}
    </Table>
  );
};

StrategyAssetsTable.displayName = "StrategyAssetsTable";
