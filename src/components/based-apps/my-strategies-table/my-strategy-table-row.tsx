import { AssetsDisplay } from "@/components/ui/assets-display";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Text, textVariants } from "@/components/ui/text";
import {
  convertToPercentage,
  currencyFormatter,
  percentageFormatter,
} from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  AccountMetadata,
  Strategy,
  StrategyMetadata,
} from "@/api/b-app.ts";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { getStrategyName } from "@/lib/utils/strategy";
import ExpandButton from "@/components/ui/expand-button.tsx";
import { AddressDisplay } from "@/components/ui/address.tsx";

export type StrategyTableRowProps = {
  strategy: Strategy &
    StrategyMetadata & { ownerAddressMetadata: AccountMetadata };
  showDepositButtonOnHover?: boolean;
  onDepositClick?: (strategy: Strategy) => void;
  onRowClick?: (strategy: Strategy) => void;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof StrategyTableRowProps> &
    StrategyTableRowProps
>;

export const MyStrategyTableRow: FCProps = ({
  strategy,
  className,
  onRowClick,
  ...props
}) => {
  const navigate = useNavigate();
  const [isInnerTableOpen, setIsInnerTableOpen] = useState(false);

  const navigateToStrategy = (strategy: Strategy) => {
    navigate(`/account/strategies/${strategy.id}`);
    useCreateStrategyContext.state.strategyData = strategy;
  };

  return (
    <>
      <TableRow
        key={strategy.id}
        className={cn("cursor-pointer max-h-7 group", className)}
        {...props}
        onClick={() => {
          if (onRowClick) return onRowClick(strategy);
          navigateToStrategy(strategy);
        }}
      >
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          {strategy.id}
        </TableCell>
        <TableCell className={textVariants({ variant: "body-3-semibold" })}>
          <Button variant="link">{getStrategyName(strategy)}</Button>
        </TableCell>
        <TableCell>
          {percentageFormatter.format(convertToPercentage(strategy.fee))}
        </TableCell>
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          <div
            className={cn(
              "w-7 h-6 rounded-[4px] flex items-center justify-center text-[10px] border ml-[20%]",
              strategy.bApps
                ? "bg-primary-50 border-primary-200 text-primary-600"
                : "bg-gray-200 border-gray-300 text-gray-600",
            )}
          >
            {strategy.bApps}
          </div>
        </TableCell>
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          <div className={"ml-[45%]"}>{strategy.deposits?.length}</div>
        </TableCell>
        <TableCell className={textVariants({ variant: "body-3-medium" })}>
          <AssetsDisplay
            max={3}
            addresses={strategy.depositedAssets.map((s) => s) as Address[]}
          />
        </TableCell>
        <TableCell
          className={`${textVariants({ variant: "body-3-medium" })} flex justify-between items-center`}
        >
          {currencyFormatter.format(Number(strategy.totalDepositedFiat) || 0)}
          {!!strategy.deposits?.length && (
            <ExpandButton
              setIsOpen={() => setIsInnerTableOpen(!isInnerTableOpen)}
              isOpen={isInnerTableOpen}
            />
          )}
        </TableCell>
      </TableRow>
      {isInnerTableOpen && (
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
              Depositors
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-gray-500",
              })}
            >
              Deposited Assets
            </TableCell>
            <TableCell
              className={textVariants({
                variant: "caption-medium",
                className: "text-gray-500",
              })}
            >
              Value
            </TableCell>
          </TableRow>
          {(strategy.deposits || []).map((depositor) => {
            return (
              <TableRow
                key={depositor.id}
                className={cn(
                  "cursor-pointer max-h-7 bg-gray-100 hover:bg-gray-100",
                  className,
                )}
                {...props}
              >
                <TableCell>
                  <Text className={"font-robotoMono"}>
                    <AddressDisplay copyable address={depositor.id} />
                  </Text>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <AssetsDisplay max={3} addresses={depositor.tokens} />
                </TableCell>
                <TableCell>
                  {currencyFormatter.format(
                    Number(depositor.depositFiatAmount) || 0,
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </>
      )}
    </>
  );
};

MyStrategyTableRow.displayName = "OperatorTableRow";
