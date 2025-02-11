import { AssetLogo } from "@/components/ui/asset-logo";
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

export type StrategyTableRowProps = {
  strategy: {
    id: string;
    name: string;
    bApps: number;
    delegators: number;
    assets: string[];
    fee: string;
    totalDelegatedValue: number | bigint;
  };
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
        <Button variant="link" as={Link} to={`/strategy/${strategy.id}`}>
          {strategy.name}
        </Button>
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <Tooltip
          content={
            <div className="flex gap-2 items-center">
              <AssetLogo
                address="0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54"
                className="size-6"
              />
              <Text>Name</Text>
            </div>
          }
        >
          <AssetLogo
            className="size-6"
            address="0x9D65fF81a3c488d585bBfb0Bfe3c7707c7917f54"
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
        {strategy.delegators}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {currencyFormatter.format(strategy.totalDelegatedValue)}
      </TableCell>
    </TableRow>
  );
};

StrategyTableRow.displayName = "OperatorTableRow";
