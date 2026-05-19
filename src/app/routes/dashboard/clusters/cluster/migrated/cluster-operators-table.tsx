import type { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/lib/utils/tw";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/grid-table";
import { OperatorAvatar } from "@/components/operator/operator-avatar";
import { OperatorStatusBadge } from "@/components/operator/operator-status-badge";
import { CopyBtn } from "@/components/ui/copy-btn";
import { SsvExplorerBtn } from "@/components/ui/ssv-explorer-btn";
import { Text } from "@/components/ui/text";
import { percentageFormatter } from "@/lib/utils/number";
import { getYearlyFee } from "@/lib/utils/operator";
import type { Operator } from "@/types/api";
import VerifiedSVG from "@/assets/images/verified.svg?react";

export type ClusterOperatorsTableProps = {
  operators: Operator[];
};

type ClusterOperatorsTableFC = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ClusterOperatorsTableProps> &
    ClusterOperatorsTableProps
>;

const GRID_COLUMNS = "minmax(200px, 1fr) 140px 80px minmax(100px, auto)";

export const ClusterOperatorsTable: ClusterOperatorsTableFC = ({
  className,
  operators,
  ...props
}) => {
  return (
    <Table
      data-testid="dashboard-cluster-operators-table"
      gridTemplateColumns={GRID_COLUMNS}
      className={cn(className)}
      {...props}
    >
      <TableHeader>
        <TableCell data-testid="dashboard-cluster-operators-table-header-name">
          <Text variant="caption-medium" className="text-gray-500">
            Name
          </Text>
        </TableCell>
        <TableCell data-testid="dashboard-cluster-operators-table-header-status">
          <Text variant="caption-medium" className="text-gray-500">
            Status
          </Text>
        </TableCell>
        <TableCell data-testid="dashboard-cluster-operators-table-header-performance">
          <Text variant="caption-medium" className="text-gray-500">
            30D
          </Text>
        </TableCell>
        <TableCell
          data-testid="dashboard-cluster-operators-table-header-fee"
          className="justify-end"
        >
          <Text variant="caption-medium" className="text-gray-500">
            1Y Fee
          </Text>
        </TableCell>
      </TableHeader>
      {operators.map((operator, index) => (
        <OperatorRow key={operator.id} operator={operator} rowIndex={index} />
      ))}
    </Table>
  );
};

ClusterOperatorsTable.displayName = "ClusterOperatorsTable";

const OperatorRow: FC<{ operator: Operator; rowIndex: number }> = ({
  operator,
  rowIndex,
}) => {
  const isInactive = operator.is_active < 1;
  const yearlyFee = getYearlyFee(BigInt(operator.eth_fee), {
    format: true,
    denomination: "ETH",
  });

  return (
    <TableRow
      data-testid="dashboard-cluster-operators-table-row"
      data-testid-index={rowIndex}
      data-testid-entity={operator.id}
      className="items-center h-[60px]"
    >
      <TableCell>
        <div className="flex items-center gap-3 min-w-0">
          <OperatorAvatar
            size="md"
            src={operator.logo}
            isPrivate={operator.is_private}
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5 h-3">
              <Text
                data-testid="dashboard-cluster-operators-table-row-name"
                variant="body-3-medium"
                className="truncate"
                title={operator.name}
              >
                {operator.name}
              </Text>
              {operator.type === "verified_operator" && (
                <VerifiedSVG
                  data-testid="dashboard-cluster-operators-table-row-verified-icon"
                  className="size-3.5 shrink-0"
                />
              )}
              <SsvExplorerBtn
                data-testid="dashboard-cluster-operators-table-row-explorer-btn"
                operatorId={operator.id}
              />
            </div>
            <div className="flex items-center gap-1">
              <Text
                data-testid="dashboard-cluster-operators-table-row-id"
                variant="caption-medium"
                className="text-gray-500"
              >
                ID: {operator.id}
              </Text>
              <CopyBtn
                data-testid="dashboard-cluster-operators-table-row-id-copy-btn"
                text={operator.id.toString()}
              />
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <OperatorStatusBadge
          data-testid="dashboard-cluster-operators-table-row-status"
          size="xs"
          status={operator.status}
        />
      </TableCell>
      <TableCell
        className={cn({
          "text-error-500": isInactive,
        })}
      >
        <Text
          data-testid="dashboard-cluster-operators-table-row-performance"
          variant="body-3-medium"
        >
          {percentageFormatter.format(operator.performance["30d"])}
        </Text>
      </TableCell>
      <TableCell className="justify-end">
        <div className="flex items-center gap-1">
          <img
            alt="ETH logo"
            src="/images/networks/dark.svg"
            className="size-5"
          />
          <Text
            data-testid="dashboard-cluster-operators-table-row-fee"
            variant="body-3-medium"
          >
            {yearlyFee}
          </Text>
        </div>
      </TableCell>
    </TableRow>
  );
};
