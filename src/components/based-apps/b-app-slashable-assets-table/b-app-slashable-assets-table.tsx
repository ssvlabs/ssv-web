import type { ComponentPropsWithoutRef, FC } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table.tsx";
import { cn } from "@/lib/utils/tw.ts";
import { Loading } from "@/components/ui/Loading.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Pagination } from "@/components/ui/pagination-v2.tsx";
import type { DelegatedSlashableAsset } from "@/api/b-app.ts";
import type { Pagination as IPagination } from "@/types/api.ts";
import BAppSlashableAssetTableRow from "@/components/based-apps/b-app-slashable-assets-table/b-app-slashable-asset-table-row.tsx";

export type AssetsTableProps = {
  assets: DelegatedSlashableAsset[];
  pagination: IPagination;
  isLoading?: boolean;
  onRowClick?: (asset: DelegatedSlashableAsset) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof Table>, keyof AssetsTableProps> &
    AssetsTableProps
>;
const BAppSlashableAssetsTable: FCProps = ({
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
          <TableHead className="w-[27%]">Assets</TableHead>
          <TableHead className="text-right w-[18%]">
            Delegated Strategies
          </TableHead>
          <TableHead className="text-right w-[18%]">Total Delegated</TableHead>
          <TableHead className="text-right w-[18%]">
            Total Delegated Value
          </TableHead>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            return (
              <BAppSlashableAssetTableRow
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

export default BAppSlashableAssetsTable;
