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
import type { FC } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "@/hooks/account/use-account";
import { EffectiveBalanceBreakDownChart } from "@/components/effective-balance/effective-balance-breakdown-chart";
import { numberFormatter } from "@/lib/utils/number";
import { ClusterHeader } from "./cluster-header";
import { OperationalRunwayBreakdown } from "./operational-runway-breakdown";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { Tab } from "@/components/ui/custom-tab";

export const MigratedCluster: FC = () => {
  const account = useAccount();

  const { clusterHash } = useClusterPageParams();

  const { cluster, isLiquidated } = useClusterState(clusterHash!, {
    balance: { watch: true },
    isLiquidated: { watch: true },
  });

  const isMigrated = cluster.data?.migrated;

  const { data: runway } = useClusterRunway(clusterHash, { watch: true });

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
    if (!isMigrated) return "Switch to ETH to enable this option";
  };

  const location = useLocation();
  const isOperatorsPage = location.pathname.includes("/operators");

  return (
    <>
      <Container variant="vertical" size="xl" className="min-h-full py-6">
        <ClusterHeader />
        <div className="flex flex-1 items-start gap-6 w-full">
          <div className="flex flex-[1] flex-col gap-6 min-w-0">
            <Card className="w-full p-6 gap-6">
              <div className="flex items-center justify-between">
                <Text variant="headline4" className="text-gray-500">
                  Effective Balance
                </Text>
                <Text variant="headline4">
                  {numberFormatter.format(
                    +(cluster.data?.effectiveBalance || 0),
                  )}{" "}
                  ETH
                </Text>
              </div>
              <EffectiveBalanceBreakDownChart clusterHash={clusterHash!} />
            </Card>
            <Card className="w-full flex-1 p-6 gap-6">
              <div className="flex items-center justify-between">
                <Text variant="headline4" className="text-gray-500">
                  Operational Runway
                </Text>
                <Text variant="headline4" className="text-gray-700">
                  {runway?.runway?.toString() ?? "0"} days
                </Text>
              </div>
              <OperationalRunwayBreakdown clusterHash={clusterHash!} />
              {isLiquidated.data ? (
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
                isMigrated={isMigrated}
              />
              <Tooltip content={getTooltipContent()}>
                <Button
                  disabled={
                    operatorsUsability.isError ||
                    operatorsUsability.data?.hasExceededValidatorsLimit ||
                    operatorsUsability.data?.hasPermissionedOperators ||
                    operatorsUsability.data?.hasDeletedOperators ||
                    isLiquidated.data ||
                    !isMigrated
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
