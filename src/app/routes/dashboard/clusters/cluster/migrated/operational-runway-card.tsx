import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaCircleInfo } from "react-icons/fa6";
import { cn } from "@/lib/utils/tw";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text, type TextProps } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useCluster } from "@/hooks/cluster/use-cluster";
import { useClusterBalance } from "@/hooks/cluster/use-cluster-balance";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useOperators } from "@/hooks/operator/use-operators";
import { useFundingCostETH } from "@/hooks/use-compute-funding-cost";
import { bigintMax } from "@/lib/utils/bigint";
import { formatETH } from "@/lib/utils/number";
import { useRefetchWhileUnavailable, withUnavailable } from "@/lib/react-query";
import { EstimatedOperationalRunwayAlert } from "@/components/cluster/estimated-operational-runway-alert";

type OperationalRunwayCardProps = {
  clusterHash: string;
  isLiquidated: boolean;
  isProjected: boolean;
  effectiveBalance: bigint;
  projectedEffectiveBalance: bigint;
};

export const OperationalRunwayCard: FC<OperationalRunwayCardProps> = ({
  clusterHash,
  isLiquidated,
  isProjected,
  effectiveBalance,
  projectedEffectiveBalance,
}) => {
  const cluster = useCluster(clusterHash);
  const operatorIds = cluster.data?.operators ?? [];

  const operatorsQuery = useOperators(operatorIds);
  const operators = operatorsQuery.data;

  const balance = useClusterBalance(clusterHash, { watch: true });

  const activeEffectiveBalance = isProjected
    ? projectedEffectiveBalance
    : effectiveBalance;

  const fundingCost = useFundingCostETH({
    operators: operators ?? [],
    fundingDays: 1,
    effectiveBalance: activeEffectiveBalance,
  });

  const deltaEffectiveBalance = projectedEffectiveBalance - effectiveBalance;

  const runwayQuery = useClusterRunway(clusterHash, {
    watch: true,
    effectiveBalance: activeEffectiveBalance,
    deltaEffectiveBalance: isProjected ? deltaEffectiveBalance : undefined,
  });
  const runway = runwayQuery.data;

  // The `?? 0n` / API-snapshot fallbacks below are indistinguishable from real
  // values, so every amount is gated on the state of the reads behind it.
  const runwayState = toValueState(
    runwayQuery.isUnavailable,
    runwayQuery.isPending,
    runwayQuery.isIdle,
  );

  // getBalance reverts for liquidated clusters; keep showing the API value
  // there as before. Otherwise never show the API snapshot as the balance.
  // Same liquidation source as useClusterBalance / useClusterRunway (API).
  const balanceStatus = withUnavailable(balance, [balance]);
  // The balance read is disabled (idle) until the cluster has loaded.
  const balanceState = toValueState(
    !cluster.data?.isLiquidated && balanceStatus.isUnavailable,
    balanceStatus.isPending,
    balanceStatus.isIdle,
  );

  // Fees are computed over `operators ?? []`, so a missing operators read
  // would silently drop the operator fee. Without the cluster the operator
  // list is `[]`, which useOperators resolves successfully: track the cluster
  // read as well.
  const clusterStatus = withUnavailable(cluster, [cluster]);
  const operatorsStatus = withUnavailable(operatorsQuery, [operatorsQuery]);
  // useOperators has no `watch`: retry a failed read until it recovers.
  useRefetchWhileUnavailable([operatorsQuery], operatorsStatus.isUnavailable);
  const feesState = toValueState(
    fundingCost.isUnavailable ||
      operatorsStatus.isUnavailable ||
      (!cluster.data && clusterStatus.isUnavailable),
    fundingCost.isLoading ||
      operatorsStatus.isPending ||
      !fundingCost.data ||
      !cluster.data,
  );

  const operationalBalanceState = toValueState(
    balanceState.isUnavailable || feesState.isUnavailable,
    balanceState.isPending || feesState.isPending,
  );

  const totalBalance = balance.data;
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
    <Card
      data-testid="dashboard-operational-runway-card"
      className="w-full flex-1 p-6 gap-6"
    >
      <div className="flex items-center justify-between">
        <Tooltip
          className="max-w-[336px]"
          content="Estimated amount of days the cluster balance is sufficient to run all its validators"
        >
          <div className="flex items-center gap-1">
            <Text
              data-testid="dashboard-operational-runway-label"
              variant="headline4"
              className="text-gray-500"
            >
              Est. Operational Runway
            </Text>
            <FaCircleInfo className="size-4 text-gray-500" />
          </div>
        </Tooltip>
        <ValueStateSwitch
          state={runwayState}
          testId="dashboard-operational-runway-days"
          variant="headline4"
          skeletonClassName="h-6 w-24"
        >
          <Text
            data-testid="dashboard-operational-runway-days"
            variant="headline4"
            className={cn(isProjected ? "text-primary-500" : "text-gray-700")}
          >
            {runway?.runway?.toString() ?? "0"} days
          </Text>
        </ValueStateSwitch>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Tooltip
            className="max-w-[336px]"
            content={
              <div className="flex flex-col gap-2 text-sm">
                <div>
                  <span className="font-bold">Burn Rate </span>
                  <span className="text-gray-500">/ day</span>
                  <p className="text-gray-500">
                    ETH deducted from this cluster per day (operator fees +
                    network fee), based on current effective balance
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Operators fee</p>
                  <p className="text-gray-500">
                    Operator charges per day, scaled by current effective
                    balance
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Network fee</p>
                  <p className="text-gray-500">
                    Network fee per day, scaled by current effective balance
                  </p>
                </div>
              </div>
            }
          >
            <div className="flex items-center gap-1.5">
              <Text variant="body-3-semibold" className="text-gray-600">
                Burn Rate
              </Text>
              <Text variant="body-3-medium" className="text-gray-500">
                / day
              </Text>
              <FaCircleInfo className="size-3.5 text-gray-500" />
            </div>
          </Tooltip>
          <ValueStateSwitch
            state={feesState}
            testId="dashboard-operational-runway-burn-rate"
          >
            <Text
              data-testid="dashboard-operational-runway-burn-rate"
              variant="body-3-bold"
              className={cn(isProjected && "text-primary-500")}
            >
              {formatETH(burnRatePerDay)} ETH
            </Text>
          </ValueStateSwitch>
        </div>
        <div className="flex flex-col gap-2">
          <Row
            label="Operators fee"
            value={`${fundingCost.data?.formatted.subtotal.operatorsCost ?? "0"} ETH`}
            isProjected={isProjected}
            state={feesState}
            testId="dashboard-operational-runway-operators-fee"
          />
          <Row
            label="Network fee"
            value={`${fundingCost.data?.formatted.subtotal.networkCost ?? "0"} ETH`}
            isProjected={isProjected}
            state={feesState}
            testId="dashboard-operational-runway-network-fee"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Tooltip
            className="max-w-[336px]"
            content={
              <div className="flex flex-col gap-2 text-sm">
                <div>
                  <p className="font-bold">Balance</p>
                  <p className="text-gray-500">
                    Current cluster ETH balance on-chain
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Operational Balance</p>
                  <p className="text-gray-500">
                    Portion of balance available to pay ongoing fees after
                    reserving liquidation collateral
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Liquidation Collateral</p>
                  <p className="text-gray-500">
                    Protected liquidation buffer excluded from operational
                    runway
                  </p>
                </div>
              </div>
            }
          >
            <div className="flex items-center gap-1">
              <Text variant="body-3-semibold" className="text-gray-600">
                Balance
              </Text>
              <FaCircleInfo className="size-3.5 text-gray-500" />
            </div>
          </Tooltip>
          <ValueStateSwitch
            state={balanceState}
            testId="dashboard-operational-runway-balance"
          >
            <Text
              data-testid="dashboard-operational-runway-balance"
              variant="body-3-bold"
            >
              {formatETH(totalBalance)} ETH
            </Text>
          </ValueStateSwitch>
        </div>
        <div className="flex flex-col gap-2">
          <Row
            label="Operational balance"
            value={`${formatETH(operationalBalance)} ETH`}
            isProjected={isProjected}
            state={operationalBalanceState}
            testId="dashboard-operational-runway-operational-balance"
          />
          <Row
            label="Liquidation Collateral"
            value={`${fundingCost.data?.formatted.subtotal.liquidationCollateral ?? "0"} ETH`}
            isProjected={isProjected}
            state={feesState}
            testId="dashboard-operational-runway-liquidation-collateral"
          />
        </div>
      </div>

      {runwayState.isReady && (
        <EstimatedOperationalRunwayAlert
          isProjected={isProjected}
          isAtRisk={runway?.isAtRisk ?? false}
          isLiquidated={isLiquidated}
          runway={runway?.runway ?? 0n}
        />
      )}
      {isLiquidated ? (
        <Button
          data-testid="dashboard-operational-runway-reactivate-btn"
          as={Link}
          to="reactivate-balance"
          size="xl"
        >
          Reactivate Cluster
        </Button>
      ) : (
        <div className="flex gap-3 [&>*]:flex-1 pt-2">
          <Button
            data-testid="dashboard-operational-runway-deposit-btn"
            as={Link}
            to="deposit"
            size="xl"
          >
            Deposit
          </Button>
          <Button
            data-testid="dashboard-operational-runway-withdraw-btn"
            as={Link}
            to="withdraw"
            size="xl"
            variant="secondary"
          >
            Withdraw
          </Button>
        </div>
      )}
    </Card>
  );
};

OperationalRunwayCard.displayName = "OperationalRunwayCard";

type ValueState = {
  isUnavailable: boolean;
  isPending: boolean;
  isReady: boolean;
};

// Idle (a read disabled until its input loads) counts as pending: the value
// shown meanwhile is a fallback, not a read.
const toValueState = (
  isUnavailable: boolean,
  isPending: boolean,
  isIdle = false,
) => {
  const pending = !isUnavailable && (isPending || isIdle);
  return {
    isUnavailable,
    isPending: pending,
    isReady: !isUnavailable && !pending,
  } satisfies ValueState;
};

const UNAVAILABLE_MESSAGE =
  "Couldn't read this value from the network. It will appear once the connection recovers.";

const ValueStateSwitch: FC<{
  state: ValueState;
  testId: string;
  variant?: TextProps["variant"];
  skeletonClassName?: string;
  children: ReactNode;
}> = ({
  state,
  testId,
  variant = "body-3-semibold",
  skeletonClassName = "h-4 w-20",
  children,
}) => {
  if (state.isUnavailable)
    return (
      <Tooltip className="max-w-[336px]" content={UNAVAILABLE_MESSAGE}>
        <Text
          as="span"
          data-testid={`${testId}-unavailable`}
          variant={variant}
          className="text-error-500"
        >
          Unavailable
        </Text>
      </Tooltip>
    );
  if (state.isPending)
    return (
      <Skeleton
        data-testid={`${testId}-loading`}
        className={skeletonClassName}
      />
    );
  return <>{children}</>;
};

const Row: FC<{
  label: string;
  value: string;
  isProjected?: boolean;
  state: ValueState;
  testId: string;
}> = ({ label, value, isProjected, state, testId }) => (
  <div className="flex items-center justify-between">
    <Text variant="body-3-medium" className="text-gray-500">
      {label}
    </Text>
    <ValueStateSwitch state={state} testId={testId}>
      <Text
        data-testid={testId}
        variant="body-3-semibold"
        className={cn(isProjected ? "text-primary-500" : "text-gray-600")}
      >
        {value}
      </Text>
    </ValueStateSwitch>
  </div>
);
