import { OperatorDetails } from "@/components/operator/operator-details";
import { OperatorStatusBadge } from "@/components/operator/operator-status-badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useOptimisticOrProvidedOperator } from "@/hooks/operator/use-optimistic-operator";
import { formatSSV, percentageFormatter } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useOperatorEarningsAndFees } from "@/hooks/operator/use-operator-earnings-and-fees";

export type OperatorTableRowProps = {
  operator: Operator;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof OperatorTableRowProps> &
    OperatorTableRowProps
>;

export const OperatorTableRow: FCProps = ({
  operator: _operator,
  className,
  ...props
}) => {
  const operator = useOptimisticOrProvidedOperator(_operator);
  const operatorId = BigInt(operator.id!);

  const { yearlyFeeEth, yearlyFeeSSV, balanceEth, balanceSSV } =
    useOperatorEarningsAndFees(operatorId);

  return (
    <TableRow
      key={operator.id}
      className={cn("cursor-pointer max-h-7", className)}
      {...props}
    >
      <TableCell className="font-medium">
        <OperatorDetails operator={operator} />
      </TableCell>
      <TableCell>
        <OperatorStatusBadge size="sm" status={operator.status} />
      </TableCell>
      <TableCell>
        {percentageFormatter.format(operator.performance["30d"])}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img src="/images/networks/dark.svg" className="size-5" /> {formatSSV(balanceEth)}
          </div>
          {balanceSSV > 0 && <div className="flex items-center gap-1 text-gray-800 font-medium">
            <span className="text-gray-300">|</span>
            <img src="/images/ssvIcons/icon.svg" className="size-5" />{" "}
            {formatSSV(balanceSSV)}
          </div>}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img src="/images/networks/dark.svg" className="size-5" /> {formatSSV(yearlyFeeEth)}
          </div>
          {yearlyFeeSSV > 0 && <div className="flex items-center gap-1 text-gray-800 font-medium">
            <span className="text-gray-300">|</span>
            <img src="/images/ssvIcons/icon.svg" className="size-5" />{" "}
            {formatSSV(yearlyFeeSSV)}
          </div>}
        </div>
      </TableCell>
      <TableCell>{operator.validators_count}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img src="/images/networks/dark.svg"
                 className="size-5" /> {formatSSV(BigInt(operator.effective_balance), 9)}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

OperatorTableRow.displayName = "OperatorTableRow";
