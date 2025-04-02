import type { BAppAsset, StrategyBApp } from "@/api/b-app.ts";
import { AssetLogo } from "@/components/ui/asset-logo";
import AssetName from "@/components/ui/asset-name.tsx";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Text, textVariants } from "@/components/ui/text";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import { useAsset } from "@/hooks/use-asset.ts";
import {
  convertToPercentage,
  currencyFormatter,
  formatSSV,
} from "@/lib/utils/number.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import ExpandButton from "@/components/ui/expand-button.tsx";

export type AssetsTableRowProps = {
  searchValue?: string;
  asset: BAppAsset;
  showDepositButtonOnHover?: boolean;
  onDepositClick?: () => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof AssetsTableRowProps> &
    AssetsTableRowProps
>;

export const StrategyAssetsTableRow: FCProps = ({
  asset,
  className,
  searchValue,
  showDepositButtonOnHover,
  onDepositClick,
  ...props
}) => {
  const [isInnerOpen, setIsInnerOpen] = useState(false);
  const { strategy } = useStrategy();
  const { name, symbol } = useAsset(asset?.token || "");
  if (searchValue && !name.toLowerCase().includes(searchValue?.toLowerCase())) {
    return;
  }
  return (
    <TableBody>
      <TableRow
        className={cn("cursor-pointer max-h-7 group", className)}
        {...props}
      >
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          <div className="flex items-center gap-2">
            <AssetLogo address={asset?.token} />
            <AssetName address={asset?.token} />
          </div>
        </TableCell>
        <TableCell>
          {asset?.totalTokens
            ? `${formatSSV(asset?.totalTokens || 0n, 18)} ${symbol}`
            : "0"}
        </TableCell>
        <TableCell>
          {asset?.totalFiat
            ? currencyFormatter.format(Number(asset?.totalFiat) || 0)
            : 0}
        </TableCell>
        <TableCell
          className={`${Number(convertToPercentage(asset?.totalDelegation || 0)) > 100 && "text-error-500"} flex items-center justify-between relative`}
        >
          <Text
            className={cn({
              "group-hover:opacity-0": showDepositButtonOnHover,
            })}
          >
            {asset?.totalDelegation
              ? `${convertToPercentage(asset?.totalDelegation || "")}%`
              : 0}
          </Text>
          {showDepositButtonOnHover && (
            <Button
              className={cn(
                "absolute hidden top-1/2 ml-7 left-0 -translate-y-1/2",
                {
                  "group-hover:block": showDepositButtonOnHover,
                },
              )}
              onClick={(ev) => {
                ev.stopPropagation();
                onDepositClick?.();
              }}
            >
              Delegate
            </Button>
          )}
          {Boolean((asset?.delegations || []).length) && (
            <ExpandButton setIsOpen={setIsInnerOpen} isOpen={isInnerOpen} />
          )}
        </TableCell>
      </TableRow>
      {isInnerOpen && (
        <TableRow
          className={cn(
            "cursor-pointer max-h-7 w-full bg-gray-100 hover:bg-gray-100",
            className,
          )}
          {...props}
        >
          <TableCell
            className={`${textVariants({ variant: "caption-medium" })} text-gray-500`}
          >
            bApp
          </TableCell>
          <TableCell />
          <TableCell />
          <TableCell
            className={`${textVariants({ variant: "caption-medium" })} flex items-center justify-end text-gray-500`}
          >
            Obligation
          </TableCell>
        </TableRow>
      )}
      {Boolean((asset?.delegations || []).length) &&
        isInnerOpen &&
        (asset?.delegations || []).map(({ bAppId, percentage }) => {
          const bApp =
            strategy.bAppsList?.find(
              (bApp: StrategyBApp) => bApp.bAppId === bAppId,
            ) || ({} as StrategyBApp);
          return (
            <TableRow
              key={bAppId}
              className={cn(
                "cursor-pointer max-h-7 w-full bg-gray-100 hover:bg-gray-100",
                className,
              )}
              {...props}
            >
              <TableCell className={textVariants({ variant: "body-3-medium" })}>
                <div className="flex items-center gap-2">
                  <img
                    className="rounded-[8px] size-7 border-gray-400 border"
                    src={
                      bApp.bAppsMetadata?.logo ||
                      "/images/operator_default_background/light.svg"
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/operator_default_background/light.svg";
                    }}
                  />
                  {bApp.bAppsMetadata?.name || shortenAddress(bApp.bAppId)}
                </div>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell
                className={`${textVariants({ variant: "body-3-medium" })} flex items-center justify-end`}
              >
                {convertToPercentage(percentage)}%
              </TableCell>
            </TableRow>
          );
        })}
    </TableBody>
  );
};

StrategyAssetsTableRow.displayName = "OperatorTableRow";
