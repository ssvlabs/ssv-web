import { ValidatorsActionsMenu } from "@/components/cluster/validators-actions-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Spacer } from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability";
import { PlusIcon } from "lucide-react";
import { type FC, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "@/hooks/account/use-account";
import { EffectiveBalanceBreakdownCard } from "@/components/effective-balance/effective-balance-breakdown-card";
import { useClusterEffectiveBalanceBreakdown } from "@/hooks/cluster/use-cluster-effective-balance-breakdown";
import { ClusterHeader } from "./cluster-header";
import { OperationalRunwayCard } from "./operational-runway-card";
import { Tab } from "@/components/ui/custom-tab";
type TabKey = "current" | "projected";

export const MigratedCluster: FC = () => {
  const account = useAccount();

  const [activeTab, setActiveTab] = useState<TabKey>("current");
  const isProjected = activeTab === "projected";

  const { clusterHash } = useClusterPageParams();
  const { cluster, isLiquidated, effectiveBalance } = useClusterState(
    clusterHash!,
    {
      balance: { watch: true },
      isLiquidated: { watch: true },
      effectiveBalance: { watch: true },
    },
  );

  const { data: effectiveBalanceBreakdown } =
    useClusterEffectiveBalanceBreakdown(clusterHash!);

  const currentEffectiveBalance = Number(effectiveBalance.data ?? 0);

  const totalBreakdownBalance =
    (effectiveBalanceBreakdown?.deposited ?? 0) +
    (effectiveBalanceBreakdown?.exited ?? 0) +
    (effectiveBalanceBreakdown?.exiting ?? 0) +
    (effectiveBalanceBreakdown?.notDeposited ?? 0) +
    (effectiveBalanceBreakdown?.pending ?? 0) +
    (effectiveBalanceBreakdown?.slashed ?? 0);

  const hasProjected =
    (effectiveBalanceBreakdown?.pending ?? 0) > 0 &&
    totalBreakdownBalance !== currentEffectiveBalance;

  const projectedEffectiveBalance = hasProjected
    ? totalBreakdownBalance
    : currentEffectiveBalance;

  const operatorsUsability = useOperatorsUsability({
    account: account.address!,
    operatorIds: cluster.data?.operators ?? [],
  });

  const getTooltipContent = () => {
    if (isLiquidated.data)
      return "You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed.";
    if (operatorsUsability.isError)
      return "Unable to fetch all operators. Adding validators is currently blocked due to unknown operator status. Please refresh the page and try again.";
    if (operatorsUsability.data?.hasDeletedOperators)
      return "One of your chosen operators has been removed by its owner. To onboard validators, you'll need to select a new cluster.";
    if (operatorsUsability.data?.hasPermissionedOperators)
      return "One of your chosen operators has shifted to a permissioned status. To onboard validators, you'll need to select a new cluster.";
    if (operatorsUsability.data?.hasExceededValidatorsLimit)
      return "One of your operators has reached their maximum number of validators";
  };

  const location = useLocation();
  const isOperatorsPage = location.pathname.includes("/operators");

  return (
    <>
      <Container variant="vertical" size="xl" className="min-h-full py-6">
        <ClusterHeader />
        <div className="flex flex-1 items-start gap-6 w-full">
          <div className="flex flex-[1] flex-col gap-6 min-w-0">
            <EffectiveBalanceBreakdownCard
              clusterHash={clusterHash!}
              effectiveBalance={currentEffectiveBalance}
              projectedEffectiveBalance={projectedEffectiveBalance}
              hasProjected={hasProjected}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <OperationalRunwayCard
              clusterHash={clusterHash!}
              isLiquidated={Boolean(isLiquidated.data)}
              isProjected={hasProjected && isProjected}
              effectiveBalance={BigInt(currentEffectiveBalance)}
              projectedEffectiveBalance={BigInt(projectedEffectiveBalance)}
            />
          </div>
          <Card className="flex-[2] h-full p-6">
            <div className="flex w-full gap-2 justify-between">
              <div className="flex gap-3 items-center">
                <Tab
                  as={Link}
                  to={`/clusters/${clusterHash}`}
                  count={cluster.data?.validatorCount}
                  data-active={!isOperatorsPage}
                >
                  Validators
                </Tab>
                <Tab
                  as={Link}
                  to={`/clusters/${clusterHash}/operators`}
                  count={cluster.data?.operators.length}
                  data-active={isOperatorsPage}
                >
                  Operators
                </Tab>
              </div>
              <Spacer />
              <ValidatorsActionsMenu
                isLiquidated={Boolean(isLiquidated.data)}
                isMigrated
              />
              <Tooltip content={getTooltipContent()}>
                <Button
                  disabled={
                    operatorsUsability.isError ||
                    operatorsUsability.data?.hasExceededValidatorsLimit ||
                    operatorsUsability.data?.hasPermissionedOperators ||
                    operatorsUsability.data?.hasDeletedOperators ||
                    isLiquidated.data
                  }
                  isLoading={
                    operatorsUsability.isLoading || isLiquidated.isLoading
                  }
                  as={Link}
                  to={`/join/validator/${clusterHash}/distribution-method`}
                >
                  <Text>Add Validator</Text>
                  <PlusIcon className="size-4" />
                </Button>
              </Tooltip>
            </div>
            <Outlet />
          </Card>
        </div>
      </Container>
    </>
  );
};

MigratedCluster.displayName = "MigratedCluster";
