import type { FC, ComponentPropsWithoutRef } from "react";
import {
  TableHeader,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Loading } from "@/components/ui/Loading.tsx";
import type { GetGlobalValidatorsBalanceResponse } from "@/api/b-app";
import { TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import {
  compactFormatter,
  currencyFormatter,
  formatSSV,
} from "@/lib/utils/number";

export type GlobalNonSlashableAssetsTableProps = {
  data?: GetGlobalValidatorsBalanceResponse;
  isLoading?: boolean;
  onRowClick?: () => void;
};

type FCProps = FC<
  Omit<
    ComponentPropsWithoutRef<typeof Table>,
    keyof GlobalNonSlashableAssetsTableProps
  > &
    GlobalNonSlashableAssetsTableProps
>;

export const GlobalNonSlashableAssetsTable: FCProps = ({
  data,
  isLoading,
  onRowClick,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <Table
        className={cn(className, "w-full rounded-xl overflow-hidden")}
        {...props}
      >
        <TableHeader>
          <TableHead className="w-[400px]">Validator Balance</TableHead>
          <TableHead>SSV Balance</TableHead>
          <TableHead className="text-right">Delegated Accounts</TableHead>
          <TableHead className="text-right">Delegated</TableHead>
          <TableHead className="text-right">Total Delegated Value</TableHead>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="bg-gray-50">
                <Loading />
              </td>
            </tr>
          ) : !data ? (
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
            <TableRow
              className={cn("cursor-pointer max-h-7", className)}
              onClick={() => {
                onRowClick?.();
              }}
            >
              <TableCell className={textVariants({ variant: "body-3-medium" })}>
                <div className="flex items-center gap-2">
                  <img
                    className={"h-[24px] w-[15px]"}
                    src={`/images/balance-validator/balance-validator.svg`}
                  />
                  Validator Balance
                </div>
              </TableCell>
              <TableCell className={textVariants({ variant: "body-3-medium" })}>
                {formatSSV(BigInt(data.ssvBalance), 9)}
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right",
                })}
              >
                <div
                  className={cn(
                    "w-7 h-6 rounded-[4px] flex items-center justify-center text-[10px] border ml-auto",
                    data.totalDelegatedAccount
                      ? "bg-primary-50 border-primary-200 text-primary-600"
                      : "bg-gray-200 border-gray-300 text-gray-600",
                  )}
                >
                  {data.totalDelegatedAccount ?? 0}
                </div>
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right",
                })}
              >
                {compactFormatter.format(Number(data.totalDelegatedFiat))}
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right text-gray-500",
                })}
              >
                {currencyFormatter.format(0)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

GlobalNonSlashableAssetsTable.displayName = "GlobalNonSlashableAssetsTable";
