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
import { Link } from "react-router-dom";
import type { Strategy } from "@/api/b-app.ts";
import { useCreateStrategyContext } from "@/guard/create-strategy-context.ts";

export type StrategyTableRowProps = {
  strategy: Strategy;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof StrategyTableRowProps> &
    StrategyTableRowProps
>;

export const StrategyTableRow: FCProps = ({
  strategy,
  className,
  ...props
}) => {
  return (
    <TableRow
      key={strategy.id}
      className={cn("cursor-pointer max-h-7", className)}
      {...props}
    >
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {strategy.id}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-semibold" })}>
        <Button
          variant="link"
          as={Link}
          to={`${strategy.id}`}
          onClick={() => {
            useCreateStrategyContext.state.strategyData = strategy;
          }}
        >
          {strategy.name}
        </Button>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <Tooltip
          content={
            <div className="flex gap-2 items-center">
              <Text>{strategy.ownerAddress}</Text>
            </div>
          }
        >
          <img
            className={cn("size-7 flex flex-wrap gap-1 rounded-md", className)}
            src={"/images/operator_default_background/light.svg"}
            alt={strategy.ownerAddress}
          />
        </Tooltip>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <div className="w-7 h-6 rounded-[4px] bg-primary-100 border border-primary-500 text-primary-500 flex items-center justify-center text-[10px]">
          {strategy.bApps}
        </div>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <AssetsDisplay
          max={3}
          addresses={strategy.assets.map((s) => s) as Address[]}
        />
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {percentageFormatter.format(convertToPercentage(strategy.fee))}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {strategy.totalDelegators || 0}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {currencyFormatter.format(Number(strategy.totalDelegatedFiat) || 0)}
      </TableCell>
    </TableRow>
  );
};

StrategyTableRow.displayName = "OperatorTableRow";
