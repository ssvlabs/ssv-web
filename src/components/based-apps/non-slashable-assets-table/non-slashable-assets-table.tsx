import type { FC, ComponentPropsWithoutRef } from "react";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Loading } from "@/components/ui/Loading.tsx";
import type { NonSlashableAsset } from "@/api/b-app";
import { NonSlashableAssetsTableRow } from "@/components/based-apps/non-slashable-assets-table/non-slashable-assets-table-row";

export type NonSlashableAssetsTableProps = {
  asset: NonSlashableAsset | undefined;
  isLoading?: boolean;
  onRowClick?: (asset: NonSlashableAsset) => void;
  updateDelegatedValue?: (
    address: string,
    delegatedValue: number,
    percentage: string,
  ) => void;
};

type FCProps = FC<
  Omit<
    ComponentPropsWithoutRef<typeof Table>,
    keyof NonSlashableAssetsTableProps
  > &
    NonSlashableAssetsTableProps
>;

export const NonSlashableAssetsTable: FCProps = ({
  asset,
  className,
  isLoading,
  updateDelegatedValue,
  onRowClick,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead className="w-[26%]">Validator Balance</TableHead>
          <TableHead className="w-[16%]">SSV Balance</TableHead>
          <TableHead className="text-right w-[18%]">
            Delegated Accounts
          </TableHead>
          <TableHead className="text-right w-[18%]">Delegated</TableHead>
          <TableHead className="text-right w-[18%]">
            Total Delegated Value
          </TableHead>
          <TableHead className="w-[52px] p-0"></TableHead>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="bg-gray-50">
                <Loading />
              </td>
            </tr>
          ) : !asset ? (
            <tr>
              <td colSpan={6} className="bg-gray-50 h-[200px]">
                <div className="flex flex-col items-center gap-4 justify-center h-full">
                  <div className="text-gray-500 text-sm">
                    No non-slashable assets found
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            <NonSlashableAssetsTableRow
              updateDelegatedValue={updateDelegatedValue}
              asset={asset}
              onClick={() => onRowClick?.(asset)}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

NonSlashableAssetsTable.displayName = "NonSlashableAssetsTable";
