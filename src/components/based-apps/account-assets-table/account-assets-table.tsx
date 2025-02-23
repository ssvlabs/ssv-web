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
import { Loading } from "@/components/ui/Loading.tsx";
import { AccountAssetsTableRow } from "@/components/based-apps/account-assets-table/account-assets-table-row";
import type { AccountAsset } from "@/hooks/b-app/use-account-assets";

export type AccountAssetsTableProps = {
  assets: AccountAsset[];
  pagination: IPagination;
  isLoading?: boolean;
  onRowClick?: (asset: AccountAsset) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof AccountAssetsTableProps> &
    AccountAssetsTableProps
>;

export const AccountAssetsTable: FCProps = ({
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
          <TableHead>Delegated Strategies</TableHead>
          <TableHead>Delegated</TableHead>
          <TableHead className="text-right">Total Delegated Value</TableHead>
          <TableHead></TableHead>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            return (
              <AccountAssetsTableRow
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

AccountAssetsTable.displayName = "AccountAssetsTable";
