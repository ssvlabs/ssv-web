import type { BAppAsset, BAppsMetaData, StrategyBApp } from "@/api/b-app.ts";
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
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import ExpandButton from "@/components/ui/expand-button.tsx";
import { getObligationData } from "@/lib/utils/manage-obligation.ts";
import InnerTableRow from "@/components/based-apps/strategy-assets-table/inner-table-row.tsx";

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
  const isAssetIncludeInStrategy = (strategy.depositsPerToken || []).some(
    ({ token }) => token.toString() === asset.token.toLowerCase(),
  );
  // const updateCount = getPendingObligationsCount({obligations: strategy.depositsPerToken, })
  return (
    <TableBody>
      <TableRow
        className={cn("cursor-pointer max-h-7 group", className)}
        {...props}
      >
        <TableCell
          className={`w-[27%] ${textVariants({ variant: "body-3-medium" })}`}
        >
          <div className="flex items-center gap-2">
            <AssetLogo address={asset?.token} />
            <AssetName address={asset?.token} />
          </div>
        </TableCell>
        <TableCell className="w-[16%]">
          {asset?.totalDepositsValue && isAssetIncludeInStrategy
            ? `${formatSSV(asset?.totalDepositsValue || 0n, 18)} ${symbol}`
            : "0"}
        </TableCell>
        <TableCell className="w-[15%]">
          {asset?.totalFiat && isAssetIncludeInStrategy
            ? currencyFormatter.format(Number(asset?.totalDepositsFiat) || 0)
            : 0}
        </TableCell>
        <TableCell
          className={`w-[100%] ${Number(convertToPercentage(asset?.totalObligatedPercentage || 0)) > 100 && "text-error-500"} flex items-center justify-between relative`}
        >
          <Text
            className={cn({
              "group-hover:opacity-0": showDepositButtonOnHover,
            })}
          >
            {asset?.totalObligatedPercentage && isAssetIncludeInStrategy
              ? `${convertToPercentage(asset?.totalObligatedPercentage || "")}%`
              : "0%"}
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
              Deposit
            </Button>
          )}
          {Boolean((asset?.obligations || []).length) && (
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
      {Boolean((asset?.obligations || []).length) &&
        isInnerOpen &&
        (asset?.obligations || []).map(({ bAppId }) => {
          const bApp =
            strategy.bAppsList?.find(
              (bApp: StrategyBApp & BAppsMetaData) => bApp.bAppId === bAppId,
            ) || ({} as StrategyBApp & BAppsMetaData);
          const obligationData = getObligationData(
            strategy.depositsPerToken || [],
            asset.token,
            bAppId,
          );

          return (
            <InnerTableRow
              strategyId={strategy.id}
              bApp={bApp}
              token={asset.token}
              obligation={
                obligationData ||
                ({} as {
                  bAppId: `0x${string}`;
                  percentage: string;
                  percentageProposed: string;
                  percentageProposedTimestamp: string;
                })
              }
            />
          );
        })}
    </TableBody>
  );
};

StrategyAssetsTableRow.displayName = "OperatorTableRow";
