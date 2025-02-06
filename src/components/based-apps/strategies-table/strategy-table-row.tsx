import { AssetLogo } from "@/components/ui/asset-logo";
import { AssetsDisplay } from "@/components/ui/assets-display";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Text, textVariants } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import type { MOCK_DATA_STRATEGIES } from "@/lib/mock/strategies";
import { currencyFormatter, percentageFormatter } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { Address } from "abitype";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Link } from "react-router-dom";

export type StrategyTableRowProps = {
  strategy: (typeof MOCK_DATA_STRATEGIES)[number];
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
        {strategy.bApps}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        <AssetsDisplay
          max={3}
          addresses={
            strategy.supportedAssets.map((s) => s.tokenAddress) as Address[]
          }
        />
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {percentageFormatter.format(strategy.fee)}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {strategy.delegators}
      </TableCell>
      <TableCell className={textVariants({ variant: "body-3-medium" })}>
        {currencyFormatter.format(strategy.valueDelegated)}
      </TableCell>
    </TableRow>
  );
};

StrategyTableRow.displayName = "OperatorTableRow";
