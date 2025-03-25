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
import type { BAppAsset } from "@/api/b-app.ts";
import { Loading } from "@/components/ui/Loading.tsx";
import { AssetsTableRow } from "@/components/based-apps/assets-table/assets-table-row";

export type AssetsTableProps = {
  assets: BAppAsset[];
  pagination: IPagination;
  isLoading?: boolean;
  onRowClick?: (asset: BAppAsset) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof AssetsTableProps> &
    AssetsTableProps
>;

export const AssetsTable: FCProps = ({
  assets,
  pagination,
  className,
  isLoading,
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
          <TableHead>Assets</TableHead>
          <TableHead>Wallet Balance</TableHead>
          <TableHead className="text-right">Delegated Strategies</TableHead>
          <TableHead className="text-right">Total Delegated</TableHead>
          <TableHead className="text-right">Total Delegated Value</TableHead>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            return (
              <AssetsTableRow
                key={asset.token}
                asset={asset}
                onClick={() => {
                  onRowClick?.(asset);
                }}
              />
            );
          })}
        </TableBody>
      </Table>
      <div className="bg-gray-50 w-full">{isLoading && <Loading />}</div>
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

AssetsTable.displayName = "AssetsTable";
