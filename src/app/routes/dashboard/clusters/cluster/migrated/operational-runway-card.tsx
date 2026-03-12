import type { FC } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils/tw";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useOperators } from "@/hooks/operator/use-operators";
import { useFundingCostETH } from "@/hooks/use-compute-funding-cost";
import { bigintMax } from "@/lib/utils/bigint";
import { formatETH } from "@/lib/utils/number";
import { EstimatedOperationalRunwayAlert } from "@/components/cluster/estimated-operational-runway-alert";

type OperationalRunwayCardProps = {
  clusterHash: string;
  isLiquidated: boolean;
  isProjected: boolean;
  deltaEffectiveBalance?: bigint;
};

export const OperationalRunwayCard: FC<OperationalRunwayCardProps> = ({
  clusterHash,
  isLiquidated,
  isProjected,
  deltaEffectiveBalance = 0n,
}) => {
  const cluster = useCluster(clusterHash);
  const operatorIds = cluster.data?.operators ?? [];

  const { data: operators } = useOperators(operatorIds);

  const effectiveBalance = bigintMax(
    BigInt(cluster.data?.effectiveBalance ?? 0),
    BigInt(cluster.data?.validatorCount ?? 1) * 32n,
  );

  const balance = useClusterBalance(clusterHash, { watch: true });

  const fundingCost = useFundingCostETH({
    operators: operators ?? [],
    fundingDays: 1,
    effectiveBalance:
      effectiveBalance + (isProjected ? deltaEffectiveBalance : 0n),
  });

  const { data: runway } = useClusterRunway(clusterHash, {
    watch: true,
    deltaEffectiveBalance: isProjected ? deltaEffectiveBalance : undefined,
  });

  const totalBalance = balance.data.eth;
  const liquidationCollateral =
    fundingCost.data?.subtotal.liquidationCollateral ?? 0n;

  const operationalBalance = bigintMax(
    totalBalance - liquidationCollateral,
    0n,
  );

  const burnRatePerDay =
    (fundingCost.data?.subtotal.operatorsCost ?? 0n) +
    (fundingCost.data?.subtotal.networkCost ?? 0n);

  return (
    <Card className="w-full flex-1 p-6 gap-6">
      <div className="flex items-center justify-between">
        <Text variant="headline4" className="text-gray-500">
          Operational Runway
        </Text>
        <Text
          variant="headline4"
          className={cn(isProjected ? "text-primary-500" : "text-gray-700")}
        >
          {runway?.runway?.toString() ?? "0"} days
        </Text>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Text variant="body-3-semibold" className="text-gray-600">
              Burn Rate
            </Text>
            <Text variant="body-3-medium" className="text-gray-500">
              / day
            </Text>
          </div>
          <Text
            variant="body-3-bold"
            className={cn(isProjected && "text-primary-500")}
          >
            {formatETH(burnRatePerDay)} ETH
          </Text>
        </div>
        <div className="flex flex-col gap-2">
          <Row
            label="Operators fee"
            value={`${fundingCost.data?.formatted.subtotal.operatorsCost ?? "0"} ETH`}
            isProjected={isProjected}
          />
          <Row
            label="Network fee"
            value={`${fundingCost.data?.formatted.subtotal.networkCost ?? "0"} ETH`}
            isProjected={isProjected}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Text variant="body-3-semibold" className="text-gray-600">
            Balance
          </Text>
          <Text variant="body-3-bold">{formatETH(totalBalance)} ETH</Text>
        </div>
        <div className="flex flex-col gap-2">
          <Row
            label="Operational balance"
            value={`${formatETH(operationalBalance)} ETH`}
            isProjected={isProjected}
          />
          <Row
            label="Liquidation Collateral"
            value={`${fundingCost.data?.formatted.subtotal.liquidationCollateral ?? "0"} ETH`}
            isProjected={isProjected}
          />
        </div>
      </div>

      <EstimatedOperationalRunwayAlert
        isProjected={isProjected}
        isAtRisk={runway?.isAtRisk ?? false}
        isLiquidated={isLiquidated}
        runway={runway?.runway ?? 0n}
      />
      {isLiquidated ? (
        <Button as={Link} to="reactivate-balance" size="xl">
          Reactivate Cluster
        </Button>
      ) : (
        <div className="flex gap-3 [&>*]:flex-1 pt-2">
          <Button as={Link} to="deposit" size="xl">
            Deposit
          </Button>
          <Button as={Link} to="withdraw" size="xl" variant="secondary">
            Withdraw
          </Button>
        </div>
      )}
    </Card>
  );
};

OperationalRunwayCard.displayName = "OperationalRunwayCard";

const Row: FC<{
  label: string;
  value: string;
  isProjected?: boolean;
}> = ({ label, value, isProjected }) => (
  <div className="flex items-center justify-between">
    <Text variant="body-3-medium" className="text-gray-500">
      {label}
    </Text>
    <Text
      variant="body-3-semibold"
      className={cn(isProjected ? "text-primary-500" : "text-gray-600")}
    >
      {value}
    </Text>
  </div>
);
