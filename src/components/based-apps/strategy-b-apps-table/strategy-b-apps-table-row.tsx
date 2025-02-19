import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import { shortenAddress } from "@/lib/utils/strings.ts";
import type { Address } from "abitype";
import { AssetsDisplay } from "@/components/ui/assets-display.tsx";
import type { StrategyBApp } from "@/api/b-app.ts";
import { convertToPercentage } from "@/lib/utils/number.ts";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import AssetName from "@/components/ui/asset-name.tsx";
import { TbExternalLink } from "react-icons/tb";
import { useLinks } from "@/hooks/use-links.ts";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
export type BAppTableRowProps = {
  bApp: StrategyBApp;
  searchValue?: string;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof BAppTableRowProps> &
    BAppTableRowProps
>;

export const StrategyBAppsTableRow: FCProps = ({
  bApp,
  searchValue,
  className,
  ...props
}) => {
  const { etherscan } = useLinks();
  const [isInnerOpen, setIsInnerOpen] = useState(false);
  const AngleComponent = isInnerOpen ? FaAngleUp : FaAngleDown;
  if (
    searchValue &&
    ((bApp.bAppsMetadata?.name &&
      !bApp.bAppsMetadata.name
        .toLowerCase()
        .includes(searchValue.toLowerCase())) ||
      !bApp.bAppId.toLowerCase().includes(searchValue.toLowerCase()))
  ) {
    return;
  }
  return (
    <TableBody>
      <TableRow className={cn("cursor-pointer max-h-7", className)} {...props}>
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
        <TableCell className="flex items-center justify-between">
          <AssetsDisplay
            max={3}
            addresses={bApp.tokens.map((s) => s) as Address[]}
          />
          {Boolean(bApp.assets.length) && (
            <AngleComponent onClick={() => setIsInnerOpen(!isInnerOpen)} />
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
            Asset
          </TableCell>
          <TableCell
            className={`${textVariants({ variant: "caption-medium" })} flex items-center justify-end text-gray-500`}
          >
            β
          </TableCell>
        </TableRow>
      )}
      {Boolean(bApp.assets.length) &&
        isInnerOpen &&
        bApp.assets.map(({ token, beta }) => (
          <TableRow
            className={cn(
              "cursor-pointer max-h-7 w-full bg-gray-100 hover:bg-gray-100",
              className,
            )}
            {...props}
          >
            <TableCell className={textVariants({ variant: "body-3-medium" })}>
              <div className="flex items-center gap-2">
                <AssetLogo address={token} />
                <AssetName address={token} />
                <a target="_blank" href={`${etherscan}/token/${token}`}>
                  <TbExternalLink className="size-3" />
                </a>
              </div>
            </TableCell>
            <TableCell
              className={`${textVariants({ variant: "body-3-medium" })} flex items-center justify-end`}
            >
              {convertToPercentage(beta)}%
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  );
};

StrategyBAppsTableRow.displayName = "StrategyBAppsTableRow";
