import { AssetLogo } from "@/components/ui/asset-logo";
import { TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { convertToPercentage } from "@/lib/utils/number.ts";
import AssetName from "@/components/ui/asset-name.tsx";
export type AssetsTableRowProps = {
  asset: {
    token: `0x${string}`;
    totalDelegation: string;
    delegations: any[];
  };
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof AssetsTableRowProps> &
    AssetsTableRowProps
>;

export const StrategyAssetsTableRow: FCProps = ({
  asset,
  className,
  ...props
}) => {
  // const isEthereum = isEthereumAddress(asset.token);

  // const { address } = useAccount();
  // const ethBalance = useBalance({ address: address! });
  //
  // const decimals = useDecimals(asset.token);
  // const tokenBalance = useBalanceOf(asset.token, { account: address! });

  return (
    <TableRow className={cn("cursor-pointer max-h-7", className)} {...props}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex items-center gap-2">
          <AssetLogo address={asset.token} />
          <AssetName address={asset.token} />
        </div>
      </TableCell>
      <TableCell>dummy</TableCell>
      <TableCell>dummy</TableCell>
      <TableCell>{convertToPercentage(asset.totalDelegation)}%</TableCell>
    </TableRow>
  );
};

StrategyAssetsTableRow.displayName = "OperatorTableRow";
