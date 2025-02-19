import { AssetLogo } from "@/components/ui/asset-logo";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import { convertToPercentage, formatSSV } from "@/lib/utils/number.ts";
import AssetName from "@/components/ui/asset-name.tsx";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useStrategy } from "@/hooks/b-app/use-strategy.ts";
import type { StrategyBApp } from "@/api/b-app.ts";
import { shortenAddress } from "@/lib/utils/strings.ts";
import { isEthereumAddress } from "@/lib/utils/token.ts";
import { useReadContract } from "wagmi";
import { TokenABI } from "@/lib/abi/token.ts";

export type AssetsTableRowProps = {
  searchValue?: string;
  asset: {
    token: `0x${string}`;
    totalDelegation: string;
    totalFiat: string;
    totalTokens: bigint;
    delegations: { bAppId: `0x${string}`; percentage: string }[];
  };
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof AssetsTableRowProps> &
    AssetsTableRowProps
>;

export const StrategyAssetsTableRow: FCProps = ({
  asset,
  className,
  searchValue,
  ...props
}) => {
  const [isInnerOpen, setIsInnerOpen] = useState(false);
  const { strategy } = useStrategy();
  const AngleComponent = isInnerOpen ? FaAngleUp : FaAngleDown;
  const isEthereum = isEthereumAddress(asset.token);

  const { data: tokenName = "Ethereum" } = useReadContract({
    abi: TokenABI,
    functionName: "name",
    address: asset.token,
    query: {
      staleTime: Infinity,
      enabled: !isEthereum,
    },
  });
  const { data: tokenSymbol = "ETH" } = useReadContract({
    abi: TokenABI,
    functionName: "symbol",
    address: asset.token,
    query: {
      staleTime: Infinity,
      enabled: !isEthereum,
    },
  });
  if (
    searchValue &&
    !tokenName.toLowerCase().includes(searchValue?.toLowerCase())
  ) {
    return;
  }
  return (
    <TableBody>
      <TableRow className={cn("cursor-pointer max-h-7", className)} {...props}>
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          <div className="flex items-center gap-2">
            <AssetLogo address={asset.token} />
            <AssetName address={asset.token} />
          </div>
        </TableCell>
        <TableCell>
          {formatSSV(asset.totalTokens, 18)} {tokenSymbol}
        </TableCell>
        <TableCell>{asset.totalFiat}</TableCell>
        <TableCell
          className={`${Number(convertToPercentage(asset.totalDelegation)) > 100 && "text-error-500"} flex items-center justify-between`}
        >
          {convertToPercentage(asset.totalDelegation)}%
          {Boolean(asset.delegations.length) && (
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
      {Boolean(asset.delegations.length) &&
        isInnerOpen &&
        asset.delegations.map(({ bAppId, percentage }) => {
          const bApp =
            strategy.bAppsList?.find(
              (bApp: StrategyBApp) => bApp.bAppId === bAppId,
            ) || ({} as StrategyBApp);
          return (
            <TableRow
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
