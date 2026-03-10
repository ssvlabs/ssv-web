import type { FC } from "react";
import { cn } from "@/lib/utils/tw";
import { Text } from "@/components/ui/text";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useOperators } from "@/hooks/operator/use-operators";
import { useFundingCostETH } from "@/hooks/use-compute-funding-cost";
import { bigintMax } from "@/lib/utils/bigint";
import { formatETH } from "@/lib/utils/number";

export type OperationalRunwayBreakdownProps = {
  clusterHash: string;
  isProjected?: boolean;
};

export const OperationalRunwayBreakdown: FC<
  OperationalRunwayBreakdownProps
> = ({ clusterHash, isProjected }) => {
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
    effectiveBalance,
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
    <>
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
    </>
  );
};

OperationalRunwayBreakdown.displayName = "OperationalRunwayBreakdown";

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
