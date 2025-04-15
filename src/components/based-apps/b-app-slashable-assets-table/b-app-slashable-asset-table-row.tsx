import { cn } from "@/lib/utils/tw.ts";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import AssetName from "@/components/ui/asset-name.tsx";
import type { DelegatedSlashableAsset } from "@/api/b-app.ts";
import type { ComponentPropsWithoutRef, FC } from "react";
import { compactFormatter, currencyFormatter } from "@/lib/utils/number.ts";
import { formatUnits } from "viem";
import { useDecimals } from "@/lib/contract-interactions/erc-20/read/use-decimals.ts";
export type AssetsTableRowProps = {
  asset: DelegatedSlashableAsset;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof AssetsTableRowProps> &
    AssetsTableRowProps
>;
const BAppSlashableAssetTableRow: FCProps = ({
  asset,
  className,
  ...props
}) => {
  const decimals = useDecimals({ tokenAddress: asset.token });

  return (
    <TableRow className={cn("cursor-pointer max-h-7", className)} {...props}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex items-center gap-2">
          <AssetLogo address={asset.token} />
          <AssetName address={asset.token} />
        </div>
      </TableCell>
      <TableCell className="text-right">{asset.delegatedStrategies}</TableCell>
      <TableCell className="text-right">
        {compactFormatter.format(
          +formatUnits(BigInt(asset.totalSlashable || 0), decimals.data || 18),
        )}
      </TableCell>
      <TableCell className="text-right">
        {currencyFormatter.format(
          +formatUnits(
            BigInt(asset.totalDelegatedValue || 0),
            decimals.data || 18,
          ),
        )}
      </TableCell>
    </TableRow>
  );
};

export default BAppSlashableAssetTableRow;
