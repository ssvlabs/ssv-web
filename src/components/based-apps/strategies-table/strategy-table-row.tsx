import { AssetsDisplay } from "@/components/ui/assets-display";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Text, textVariants } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import {
  convertToPercentage,
  currencyFormatter,
  percentageFormatter,
} from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useNavigate } from "react-router-dom";
import type {
  AccountMetadata,
  Strategy,
  StrategyMetadata,
} from "@/api/b-app.ts";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";
import { getStrategyName } from "@/lib/utils/strategy";

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

export const StrategyTableRow: FCProps = ({
  strategy,
  className,
  showDepositButtonOnHover = false,
  onDepositClick,
  onRowClick,
  ...props
}) => {
  const navigate = useNavigate();

  const navigateToStrategy = (strategy: Strategy) => {
    navigate(`/account/strategies/${strategy.id}`);
    useCreateStrategyContext.state.strategyData = strategy;
  };

  return (
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
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <Tooltip
          content={
            <div className="flex gap-2 items-center">
              <Text>
                {strategy.ownerAddressMetadata?.name || strategy.ownerAddress}
              </Text>
            </div>
          }
        >
          <img
            className={cn("size-7 flex flex-wrap gap-1 rounded-md", className)}
            src={
              strategy.ownerAddressMetadata?.logo ||
              "/images/operator_default_background/light.svg"
            }
            alt={strategy.ownerAddress}
          />
        </Tooltip>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="w-7 h-6 rounded-[4px] border bg-primary-50 border-primary-200 text-primary-600 flex items-center justify-center text-[10px]">
          {strategy.bApps}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <AssetsDisplay
          max={3}
          addresses={strategy.delegatedAssets.map((s) => s) as Address[]}
        />
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {percentageFormatter.format(convertToPercentage(strategy.fee))}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {strategy.totalDelegators || 0}
      </TableCell>
      <TableCell
        className={textVariants({
          variant: "body-3-medium",
          className: "relative",
        })}
      >
        <Text
          className={cn({
            "group-hover:opacity-0": showDepositButtonOnHover,
          })}
        >
          {currencyFormatter.format(Number(strategy.totalDelegatedFiat) || 0)}
        </Text>
        <Button
          className={cn(
            "absolute hidden top-1/2 ml-7 left-0 -translate-y-1/2",
            {
              "group-hover:block": showDepositButtonOnHover,
            },
          )}
          onClick={(ev) => {
            ev.stopPropagation();
            onDepositClick?.(strategy);
          }}
        >
          Deposit
        </Button>
      </TableCell>
    </TableRow>
  );
};

StrategyTableRow.displayName = "OperatorTableRow";
