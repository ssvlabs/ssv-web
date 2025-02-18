import type { BAppAsset } from "@/api/b-app";
import { AssetLogo } from "@/components/ui/asset-logo";
import { TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { useAccount } from "@/hooks/account/use-account";
import { useBalanceOf } from "@/lib/contract-interactions/erc-20/read/use-balance-of";
import { useDecimals } from "@/lib/contract-interactions/erc-20/read/use-decimals";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import { formatSSV } from "@/lib/utils/number";
import { compactFormatter } from "../../../lib/utils/number";
import { isEthereumTokenAddress } from "@/lib/utils/token";
export type AssetsTableRowProps = {
  asset: BAppAsset;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof AssetsTableRowProps> &
    AssetsTableRowProps
>;

export const AssetsTableRow: FCProps = ({ asset, className, ...props }) => {
  const isEthereum = isEthereumTokenAddress(asset.token);

  const { address } = useAccount();
  const ethBalance = useBalance({ address: address! });

  const decimals = useDecimals(asset.token);
  const tokenBalance = useBalanceOf(asset.token, { account: address! });

  return (
    <TableRow className={cn("cursor-pointer max-h-7", className)} {...props}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <AssetLogo address={asset.token} />
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {isEthereum
          ? formatSSV(ethBalance.data?.value || 0n)
          : formatSSV(tokenBalance.data || 0n, decimals?.data || 18)}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {asset.obligationsCount}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {formatSSV(BigInt(asset.totalObligatedBalance))}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {compactFormatter.format(
          +formatEther(BigInt(asset.totalObligatedBalance)),
        )}
      </TableCell>
    </TableRow>
  );
};

AssetsTableRow.displayName = "OperatorTableRow";
