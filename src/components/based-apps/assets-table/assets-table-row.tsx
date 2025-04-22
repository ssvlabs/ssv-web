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
import { formatUnits } from "viem";
import { compactFormatter, formatSSV } from "@/lib/utils/number";
import { currencyFormatter } from "../../../lib/utils/number";
import { isEthereumTokenAddress } from "@/lib/utils/token";
import AssetName from "@/components/ui/asset-name";
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

  const decimals = useDecimals({ tokenAddress: asset.token });
  const tokenBalance = useBalanceOf({
    tokenAddress: asset.token,
    account: address!,
  });

  return (
    <TableRow className={cn("cursor-pointer max-h-7", className)} {...props}>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="flex items-center gap-2">
          <AssetLogo address={asset.token} />
          <AssetName address={asset.token} />
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {isEthereum
          ? formatSSV(ethBalance.data?.value || 0n)
          : formatSSV(tokenBalance.data || 0n, decimals?.data || 18)}
      </TableCell>
      <TableCell
        className={textVariants({
          variant: "body-3-medium",
          className: "text-right",
        })}
      >
        {asset.depositedStrategies}
      </TableCell>
      <TableCell
        className={textVariants({
          variant: "body-3-medium",
          className: "text-right",
        })}
      >
        {compactFormatter.format(
          +formatUnits(
            BigInt(asset.totalDepositsValue || 0),
            decimals.data || 18,
          ),
        )}
      </TableCell>
      <TableCell
        className={textVariants({
          variant: "body-3-medium",
          className: "text-right text-gray-500",
        })}
      >
        {currencyFormatter.format(0)}
      </TableCell>
    </TableRow>
  );
};

AssetsTableRow.displayName = "OperatorTableRow";
