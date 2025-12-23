import { OperatorDetails } from "@/components/operator/operator-details";
import { OperatorStatusBadge } from "@/components/operator/operator-status-badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useOptimisticOrProvidedOperator } from "@/hooks/operator/use-optimistic-operator";
import { useGetOperatorEarnings } from "@/lib/contract-interactions/read/use-get-operator-earnings";
import { useGetOperatorFee } from "@/lib/contract-interactions/read/use-get-operator-fee";
import { formatSSV, percentageFormatter } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import { cn } from "@/lib/utils/tw";
import type { Operator } from "@/types/api";
import type { ComponentPropsWithoutRef, FC } from "react";

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
  const fee = useGetOperatorFee({ operatorId: BigInt(_operator.id) });

  const balance = useGetOperatorEarnings({
    id: BigInt(operator.id),
  });

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
            <img src="/images/networks/dark.svg" className="size-5" /> 0.9384
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img src="/images/ssvIcons/icon.svg" className="size-5" />{" "}
            {formatSSV(balance.data ?? 0n)}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img src="/images/networks/dark.svg" className="size-5" /> 0.0123
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 text-gray-800 font-medium">
            <img src="/images/ssvIcons/icon.svg" className="size-5" />{" "}
            {formatSSV(getYearlyFee(BigInt(fee.data ?? 0n)))}
          </div>
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
