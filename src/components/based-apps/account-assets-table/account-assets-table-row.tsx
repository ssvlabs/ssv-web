import { AssetLogo } from "@/components/ui/asset-logo";
import { TableCell, TableRow } from "@/components/ui/table";
import { Text, textVariants } from "@/components/ui/text";
import { cn } from "@/lib/utils/tw";
import { useState, type ComponentPropsWithoutRef, type FC } from "react";
import { currencyFormatter, formatSSV } from "@/lib/utils/number";
import type { AccountAsset } from "@/hooks/b-app/use-account-assets";
import AssetName from "@/components/ui/asset-name";
import ExpandButton from "@/components/ui/expand-button.tsx";
import { DelegationRow } from "./account-row-delegation";
import { useGetTotalWithdrawalRequests } from "@/hooks/b-app/use-asset-withdrawal-request";
import { useStrategyAssetWithdrawFeatureFlag } from "@/hooks/feature-flags/use-withdraw-feature-flag";

export type AccountAssetsTableRowProps = {
  asset: AccountAsset;
  onWithdrawClick?: (strategyId: string) => void;
  onDelegateClick?: (strategyId: string) => void;
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
  onWithdrawClick,
  onDelegateClick,
  ...props
}) => {
  const hasDelegations = Boolean(asset.slashableAsset?.deposits?.length);
  const totalRequests = useGetTotalWithdrawalRequests({
    strategyIds:
      asset.slashableAsset?.deposits.map(
        (delegation) => delegation.strategyId,
      ) || [],
    asset: asset.token,
  });

  const [isOpen, setIsOpen] = useState(false);
  const withdrawFeatureFlag = useStrategyAssetWithdrawFeatureFlag();
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
          className={` w-[343px] ${textVariants({ variant: "body-3-medium" })}`}
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
          <div className="flex items-center justify-end gap-2">
            <Text>
              {currencyFormatter.format(+asset.totalFiatDepositAmount)}
            </Text>
            {totalRequests > 0 && withdrawFeatureFlag.enabled && (
              <div
                className={cn(
                  "flex items-center justify-center size-4 text-[10px] font-bold border-[2px] text-[#fff] bg-primary-400 border-primary-500 rounded-full",
                  className,
                )}
                {...props}
              >
                {totalRequests}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          className={textVariants({
            variant: "body-3-medium",
            className: "w-[52px] p-0 flex justify-center items-center",
          })}
        >
          {hasDelegations ? (
            <ExpandButton setIsOpen={setIsOpen} isOpen={isOpen} />
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
                className: "text-gray-500 text-right",
              })}
            >
              Deposited
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
                className: "w-[52px] p-0",
              })}
            ></TableCell>
          </TableRow>
          {asset.slashableAsset?.deposits.map((delegation) => (
            <DelegationRow
              key={delegation.strategyId}
              delegation={delegation}
              asset={asset}
              className={className}
              onWithdrawClick={onWithdrawClick}
              onDelegateClick={onDelegateClick}
            />
          ))}
        </>
      )}
    </>
  );
};

AccountAssetsTableRow.displayName = "OperatorTableRow";
