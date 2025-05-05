import type { FC, ComponentPropsWithoutRef } from "react";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/tw";
import { Loading } from "@/components/ui/Loading.tsx";
import type { AccountMetadata, BApp, NonSlashableAsset } from "@/api/b-app";
import { Span, textVariants } from "@/components/ui/text.tsx";
import { currencyFormatter, formatSSV } from "@/lib/utils/number.ts";

export type BAppNonSlashableAssetsTableProps = {
  asset: Pick<
    BApp,
    | "delegatedAccounts"
    | "totalDelegatedValueNonSlashable"
    | "totalDelegatedValue"
  >;
  isLoading?: boolean;
  onRowClick?: (asset: NonSlashableAsset) => void;
  updateDelegatedValue?: (
    address: string,
    delegatedValue: number,
    percentage: string,
    metadata?: AccountMetadata,
  ) => void;
};

type FCProps = FC<
  Omit<
    ComponentPropsWithoutRef<typeof Table>,
    keyof BAppNonSlashableAssetsTableProps
  > &
    BAppNonSlashableAssetsTableProps
>;

export const BAppNonSlashableAssetsTable: FCProps = ({
  asset,
  className,
  isLoading,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead className="w-[26%]">Delegatable Asset</TableHead>
          <TableHead className="text-right w-[18%]">
            Delegated Accounts
          </TableHead>
          <TableHead className="text-right w-[18%]">Total Delegated</TableHead>
          <TableHead className="text-right w-[18%]">
            Total Delegated Value
          </TableHead>
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
            <TableRow className={cn("cursor-pointer max-h-7", className)}>
              <TableCell className={textVariants({ variant: "body-3-medium" })}>
                <div className="flex items-center gap-2">
                  <img
                    className={"h-[24px] w-[15px]"}
                    src={`/images/balance-validator/balance-validator.svg`}
                  />
                  Validator Balance <Span className="text-gray-500">ETH</Span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div
                  className={cn(
                    "w-7 h-6 rounded-[4px] flex items-center justify-center text-[10px] border ml-auto",
                    asset.delegatedAccounts
                      ? "bg-primary-50 border-primary-200 text-primary-600"
                      : "bg-gray-200 border-gray-300 text-gray-600",
                  )}
                >
                  {asset.delegatedAccounts ?? 0}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatSSV(asset.totalDelegatedValue)} ETH
              </TableCell>
              <TableCell className="text-right">
                {currencyFormatter.format(
                  +asset.totalDelegatedValueNonSlashable || 0,
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

BAppNonSlashableAssetsTable.displayName = "BAppNonSlashableAssetsTable";
