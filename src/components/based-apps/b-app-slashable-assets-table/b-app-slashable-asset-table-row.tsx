import { cn } from "@/lib/utils/tw.ts";
import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { textVariants } from "@/components/ui/text.tsx";
import { AssetLogo } from "@/components/ui/asset-logo.tsx";
import AssetName from "@/components/ui/asset-name.tsx";
import type { DepositedToken } from "@/api/b-app.ts";
import type { ComponentPropsWithoutRef, FC } from "react";
import { compactFormatter } from "@/lib/utils/number.ts";
import { formatUnits } from "viem";
import { useDecimals } from "@/lib/contract-interactions/erc-20/read/use-decimals.ts";
export type AssetsTableRowProps = {
  asset: DepositedToken;
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
      <TableCell className="text-right">
        <div
          className={cn(
            "w-7 h-6 rounded-[4px] flex items-center justify-center text-[10px] border ml-auto",
            asset.depositedStrategies
              ? "bg-primary-50 border-primary-200 text-primary-600"
              : "bg-gray-200 border-gray-300 text-gray-600",
          )}
        >
          {asset.depositedStrategies}
        </div>
      </TableCell>
      <TableCell className="text-right">
        {compactFormatter.format(
          +formatUnits(
            BigInt(asset.totalDepositsValue || 0),
            decimals.data || 18,
          ),
        )}
      </TableCell>
      <TableCell className="text-right">
        {compactFormatter.format(
          +formatUnits(
            BigInt(asset.totalDepositsFiat || 0),
            decimals.data || 18,
          ),
        )}
      </TableCell>
    </TableRow>
  );
};

export default BAppSlashableAssetTableRow;
