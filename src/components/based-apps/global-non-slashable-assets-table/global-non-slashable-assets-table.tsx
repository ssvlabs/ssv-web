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
import { Span, Text, textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import {
  compactFormatter,
  currencyFormatter,
  formatSSV,
} from "@/lib/utils/number";
import { Tooltip } from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { formatUnits } from "viem";

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
          <TableRow>
            <TableHead className="w-[400px]">Delegatable asset</TableHead>
            <TableHead>
              {" "}
              <Tooltip
                asChild
                className="max-w-max"
                content="Total effective balance (ETH) of all validators within your DVT clusters"
              >
                <div className="flex items-center gap-1">
                  <Text>My Balance</Text> <FaInfoCircle />{" "}
                </div>
              </Tooltip>
            </TableHead>
            <TableHead className="text-right">Delegated Accounts</TableHead>
            <TableHead className="text-right">Total Delegated</TableHead>
            <TableHead className="text-right">Total Delegated Value</TableHead>
          </TableRow>
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
                  Validator Balance <Span className="text-gray-500">ETH</Span>
                </div>
              </TableCell>
              <TableCell className={textVariants({ variant: "body-3-medium" })}>
                {formatSSV(BigInt(data.ssvBalance || 0n))}
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right flex items-center justify-end",
                })}
              >
                <div
                  className={cn(
                    "w-7 h-6 rounded-[4px] flex items-center justify-center text-[10px] border",
                    data.delegatedAccounts
                      ? "bg-primary-50 border-primary-200 text-primary-600"
                      : "bg-gray-200 border-gray-300 text-gray-600",
                  )}
                >
                  {data.delegatedAccounts ?? 0}
                </div>
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right",
                })}
              >
                {compactFormatter.format(
                  Number(formatUnits(data.totalDelegatedValue || 0n, 18)),
                )}
                &nbsp; ETH
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right text-gray-500",
                })}
              >
                {currencyFormatter.format(+data.totalDelegatedFiat || 0)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

GlobalNonSlashableAssetsTable.displayName = "GlobalNonSlashableAssetsTable";
