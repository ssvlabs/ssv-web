import { TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";
import {
  compactFormatter,
  currencyFormatter,
  formatSSV,
} from "@/lib/utils/number";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils/strings";
import { formatGwei, formatUnits } from "viem";
import type { NonSlashableAsset } from "@/api/b-app";
import ExpandButton from "@/components/ui/expand-button.tsx";

export type NonSlashableAssetsTableRowProps = {
  asset: NonSlashableAsset;
  updateDelegatedValue?: (
    address: string,
    delegatedValue: number,
    percentage: string,
  ) => void;
};

type FCProps = FC<
  Omit<
    ComponentPropsWithoutRef<typeof TableRow>,
    keyof NonSlashableAssetsTableRowProps
  > &
    NonSlashableAssetsTableRowProps
>;

export const NonSlashableAssetsTableRow: FCProps = ({
  asset,
  className,
  onClick,
  updateDelegatedValue,
  ...props
}) => {
  const hasDelegations = Boolean(asset.delegations?.length);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedRow, setFocusedRow] = useState(-1);

  const effectiveBalance = Number(formatGwei(asset.effectiveBalance));

  const totalDelegatedPercentage =
    asset.delegations?.reduce(
      (acc, delegation) => acc + Number(delegation.percentage),
      0,
    ) / 10000;

  const totalDelegatedValue = totalDelegatedPercentage * effectiveBalance;

  return (
    <>
      <TableRow
        className={cn("cursor-pointer max-h-7", className)}
        {...props}
        onClick={(ev) => {
          onClick?.(ev);
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
          {formatSSV(asset.effectiveBalance, 9)}
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
              hasDelegations
                ? "bg-primary-50 border-primary-200 text-primary-600"
                : "bg-gray-200 border-gray-300 text-gray-600",
            )}
          >
            {asset.delegations?.length ?? 0}
          </div>
        </TableCell>
        <TableCell
          className={textVariants({
            variant: "body-3-medium",
            className: "text-right",
          })}
        >
          {compactFormatter.format(totalDelegatedValue)}
        </TableCell>
        <TableCell
          className={textVariants({
            variant: "body-3-medium",
            className: "text-right text-gray-500",
          })}
        >
          {currencyFormatter.format(0)}
        </TableCell>
        <TableCell
          className={textVariants({
            variant: "body-3-medium",
            className: "w-[52px] p-0",
          })}
        >
          {hasDelegations ? (
            <ExpandButton setIsOpen={setIsOpen} isOpen={isOpen} />
          ) : null}
        </TableCell>
      </TableRow>
      {isOpen && hasDelegations && (
        <>
          <TableRow
            className={cn(
              "cursor-pointer max-h-7 bg-gray-100 hover:bg-gray-100",
              className,
            )}
            {...props}
          >
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-gray-500",
              })}
            >
              Delegated Accounts
            </TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-gray-500",
              })}
            >
              Percentage
            </TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-gray-500",
              })}
            ></TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-right text-gray-500",
              })}
            >
              Delegated
            </TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-right text-gray-500",
              })}
            >
              Value
            </TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "w-5",
              })}
            ></TableCell>
          </TableRow>
          {asset.delegations.map((delegation, index) => {
            const percentage = Number(
              formatUnits(BigInt(delegation.percentage), 2),
            );
            const delegatedValue =
              Math.floor(percentage * effectiveBalance * 100) / 10000;
            return (
              <TableRow
                onFocus={() => setFocusedRow(index)}
                onMouseEnter={() => setFocusedRow(index)}
                onMouseLeave={() => setFocusedRow(-1)}
                key={delegation.receiver.id}
                className={cn(
                  "cursor-pointer max-h-7 bg-gray-100 hover:bg-gray-100",
                  className,
                )}
                {...props}
              >
                <TableCell
                  className={textVariants({ variant: "body-3-medium" })}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="rounded-[8px] size-7 border-gray-400 border"
                      src={"/images/operator_default_background/light.svg"}
                    />
                    {shortenAddress(delegation.receiver.id)}
                  </div>
                </TableCell>
                <TableCell
                  className={textVariants({ variant: "body-3-medium" })}
                >
                  {formatUnits(BigInt(delegation.percentage), 2)}%
                </TableCell>
                <TableCell
                  className={textVariants({ variant: "body-3-medium" })}
                ></TableCell>
                <TableCell
                  className={textVariants({
                    variant: "body-3-medium",
                    className: "text-right",
                  })}
                >
                  {delegatedValue}
                </TableCell>
                <TableCell
                  className={textVariants({
                    variant: "body-3-medium",
                    className: "text-right text-gray-500 p-0",
                  })}
                >
                  {focusedRow === index && updateDelegatedValue ? (
                    <Button
                      onClick={() =>
                        updateDelegatedValue(
                          delegation?.receiver?.id || "",
                          delegatedValue,
                          delegation.percentage,
                        )
                      }
                    >
                      Update
                    </Button>
                  ) : (
                    currencyFormatter.format(0)
                  )}
                </TableCell>
                <TableCell
                  className={textVariants({
                    variant: "body-3-medium",
                    className: "w-5",
                  })}
                ></TableCell>
              </TableRow>
            );
          })}
        </>
      )}
    </>
  );
};

NonSlashableAssetsTableRow.displayName = "NonSlashableAssetsTableRow";
