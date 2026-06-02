import { OperatorDetails } from "@/components/operator/operator-details";
import { OperatorStatusBadge } from "@/components/operator/operator-status-badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useOptimisticOrProvidedOperator } from "@/hooks/operator/use-optimistic-operator";
import { formatETH, formatSSV, percentageFormatter } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";
import { useOperatorEarningsAndFees } from "@/hooks/operator/use-operator-earnings-and-fees";

export type OperatorTableRowProps = {
  operator: Operator;
  rowIndex?: number;
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<typeof TableRow>, keyof OperatorTableRowProps> &
    OperatorTableRowProps
>;

export const OperatorTableRow: FCProps = ({
  operator: _operator,
  rowIndex,
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
      data-testid="dashboard-operators-table-row"
      data-testid-index={rowIndex}
      data-testid-entity={operator.id}
      className={cn("cursor-pointer max-h-7", className)}
      {...props}
    >
      <TableCell
        data-testid="dashboard-operators-table-row-name"
        className="font-medium"
      >
        <OperatorDetails operator={operator} />
      </TableCell>
      <TableCell data-testid="dashboard-operators-table-row-status">
        <OperatorStatusBadge size="sm" status={operator.status} />
      </TableCell>
      <TableCell data-testid="dashboard-operators-table-row-performance">
        {percentageFormatter.format(operator.performance["30d"])}
      </TableCell>
      <TableCell data-testid="dashboard-operators-table-row-balance">
        <div className="flex items-center gap-2 w-max">
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img
              alt="ETH logo"
              src="/images/networks/dark.svg"
              className="size-5"
            />{" "}
            <span data-testid="dashboard-operators-table-row-balance-eth">
              {formatETH(balanceEth)}
            </span>
          </div>
          {balanceSSV > 0 && (
            <div className="flex items-center gap-1 text-gray-800 font-medium">
              <span className="text-gray-300">|</span>
              <img
                alt="SSV logo"
                src="/images/ssvIcons/icon.svg"
                className="size-5"
              />{" "}
              <span data-testid="dashboard-operators-table-row-balance-ssv">
                {formatSSV(balanceSSV)}
              </span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell data-testid="dashboard-operators-table-row-yearly-fee">
        <div className="flex items-center gap-2 w-max">
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img
              alt="ETH logo"
              src="/images/networks/dark.svg"
              className="size-5"
            />{" "}
            <span data-testid="dashboard-operators-table-row-yearly-fee-eth">
              {formatETH(yearlyFeeEth)}
            </span>
          </div>
          {yearlyFeeSSV > 0 && (
            <div className="flex items-center gap-1 text-gray-800 font-medium">
              <span className="text-gray-300">|</span>
              <img
                alt="SSV logo"
                src="/images/ssvIcons/icon.svg"
                className="size-5"
              />{" "}
              <span data-testid="dashboard-operators-table-row-yearly-fee-ssv">
                {formatSSV(yearlyFeeSSV)}
              </span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell data-testid="dashboard-operators-table-row-validators-count">
        {operator.validators_count}
      </TableCell>
      <TableCell data-testid="dashboard-operators-table-row-effective-balance">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img
              alt="ETH logo"
              src="/images/networks/dark.svg"
              className="size-5"
            />{" "}
            {operator.effective_balance}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

OperatorTableRow.displayName = "OperatorTableRow";
