import { AssetLogo } from "@/components/ui/asset-logo";
import { TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";
import { currencyFormatter, formatSSV } from "@/lib/utils/number";
import { ChevronDown } from "lucide-react";
import type { AccountAsset } from "@/hooks/b-app/use-account-assets";
import { Link } from "react-router-dom";
import { Button, IconButton } from "@/components/ui/button";
import AssetName from "@/components/ui/asset-name";
export type AccountAssetsTableRowProps = {
  asset: AccountAsset;
};

type FCProps = FC<
  Omit<
    ComponentPropsWithoutRef<typeof TableRow>,
    keyof AccountAssetsTableRowProps
  > &
    AccountAssetsTableRowProps
>;

export const AccountAssetsTableRow: FCProps = ({
  asset,
  className,
  onClick,
  ...props
}) => {
  const hasDelegations = Boolean(asset.slashableAsset?.deposits?.length);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TableRow
        className={cn("cursor-pointer max-h-7", className)}
        {...props}
        onClick={(ev) => {
          onClick?.(ev);
        }}
      >
        <TableCell
          className={`w-[320px] ${textVariants({ variant: "body-3-medium" })}`}
        >
          <div className="flex items-center gap-2">
            <AssetLogo address={asset.token} />
            <AssetName address={asset.token} />
          </div>
        </TableCell>
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          {formatSSV(asset.tokenInfo.balance, asset.tokenInfo.decimals)}
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
            {asset.slashableAsset?.deposits?.length ?? 0}
          </div>
        </TableCell>
        <TableCell
          className={textVariants({
            variant: "body-3-medium",
            className: "text-right",
          })}
        >
          {formatSSV(
            BigInt(asset.totalDepositAmount ?? 0),
            asset.tokenInfo.decimals,
          )}
        </TableCell>
        <TableCell
          className={textVariants({
            variant: "body-3-medium",
            className: "text-right text-gray-500",
          })}
        >
          {currencyFormatter.format(+asset.totalFiatDepositAmount)}
        </TableCell>
        <TableCell
          className={textVariants({
            variant: "body-3-medium",
            className: "w-[52px] p-0",
          })}
        >
          {hasDelegations ? (
            <IconButton
              variant="ghost"
              onClick={(ev) => {
                ev.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <ChevronDown
                className={cn("size-4", {
                  "transform rotate-180": isOpen,
                })}
              />
            </IconButton>
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
              Strategies
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
                className: "text-gray-500",
              })}
            ></TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-gray-500",
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
          {asset.slashableAsset?.deposits.map((delegation) => (
            <TableRow
              className={cn(
                "cursor-pointer max-h-7 bg-gray-100 hover:bg-gray-100",

                className,
              )}
              {...props}
            >
              <TableCell className={textVariants({ variant: "body-3-medium" })}>
                <Button
                  variant="link"
                  size="sm"
                  as={Link}
                  className="px-2"
                  to={`/account/strategies/${delegation.strategyId}`}
                >
                  {delegation.strategyId}
                </Button>
              </TableCell>
              <TableCell
                className={textVariants({ variant: "body-3-medium" })}
              ></TableCell>
              <TableCell
                className={textVariants({ variant: "body-3-medium" })}
              ></TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right",
                })}
              >
                {formatSSV(
                  BigInt(delegation.depositAmount),
                  asset.tokenInfo.decimals,
                )}
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "text-right text-gray-500",
                })}
              >
                {currencyFormatter.format(+delegation.fiatDepositAmount)}
              </TableCell>
              <TableCell
                className={textVariants({
                  variant: "body-3-medium",
                  className: "w-5",
                })}
              ></TableCell>
            </TableRow>
          ))}
        </>
      )}
    </>
  );
};

AccountAssetsTableRow.displayName = "OperatorTableRow";
