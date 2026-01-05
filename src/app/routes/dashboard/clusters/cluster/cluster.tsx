import { ClusterValidatorsList } from "@/components/cluster/cluster-validators-list";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { ValidatorsActionsMenu } from "@/components/cluster/validators-actions-menu";
import { OperatorStatCard } from "@/components/operator/operator-stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Skeleton } from "@/components/ui/skeleton";
import { Spacer } from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability";
import { PlusIcon } from "lucide-react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "@/hooks/account/use-account";
import { BalanceDisplay } from "@/components/ui/balance-display";
import { SwitchToEthMenuOptionTooltip } from "@/components/cluster/switch-to-eth-menu-option-tooltip";

export const Cluster: FC = () => {
  const account = useAccount();
  const { clusterHash } = useClusterPageParams();

  const { cluster, isLiquidated, balanceSSV, balanceETH } = useClusterState(
    clusterHash!,
    {
      balance: { watch: true },
      isLiquidated: { watch: true },
    },
  );

  const isMigrated = cluster.data?.migrated;

  const isLoadingBalance = isMigrated
    ? balanceETH.isLoading
    : balanceSSV.isLoading;

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
    if (isMigrated) return "Switch to ETH to enable this option";
  };

  return (
    <Container
      variant="vertical"
      size="xl"
      className="min-h-full py-6"
      navigateRoutePath={"/clusters"}
      backButtonLabel={"Clusters"}
    >
      <div className="grid grid-cols-4 gap-6 w-full">
        {cluster.data?.operators.map((operatorId) => (
          <OperatorStatCard
            key={operatorId}
            className="w-full"
            operatorId={operatorId}
          />
        ))}
      </div>
      <div className="flex flex-1 items-start gap-6 w-full">
        <Card className="flex-[1]">
          <div className="flex flex-col gap-2 ">
            <div className="flex gap-2 items-center">
              <Text variant="headline4" className="text-gray-500">
                Balance
              </Text>
              {isLiquidated.data && <Badge variant="error">Liquidated</Badge>}
            </div>
            {isLoadingBalance ? (
              <Skeleton className="h-10 w-24 my-1" />
            ) : (
              <BalanceDisplay
                amount={BigInt(
                  isMigrated ? balanceETH.data || 0n : balanceSSV.data || 0n,
                )}
                token={isMigrated ? "ETH" : "SSV"}
              />
            )}
          </div>
          {Boolean(cluster.data?.validatorCount) && (
            <>
              <Divider />
              {isLoadingBalance ? (
                <div className="space-y-1">
                  <Skeleton className="h-6 w-[208px] " />
                  <Skeleton className="h-7 w-24 " />
                </div>
              ) : (
                <EstimatedOperationalRunway />
              )}
              <Divider />
            </>
          )}

          {isLiquidated.data ? (
            <Button as={Link} to="reactivate" size="xl">
              Reactivate Cluster
            </Button>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex gap-6 [&>*]:flex-1">
                <SwitchToEthMenuOptionTooltip asChild enabled={isMigrated}>
                  <Button
                    as={Link}
                    to="deposit"
                    size="xl"
                    disabled={isMigrated}
                  >
                    Deposit
                  </Button>
                </SwitchToEthMenuOptionTooltip>
                <SwitchToEthMenuOptionTooltip asChild enabled={isMigrated}>
                  <Button
                    as={Link}
                    to="withdraw"
                    size="xl"
                    variant="secondary"
                    disabled={isMigrated}
                  >
                    Withdraw
                  </Button>
                </SwitchToEthMenuOptionTooltip>
              </div>
              {isMigrated && (
                <Button
                  as={Link}
                  to={`/switch-wizard/${clusterHash}`}
                  size="xl"
                  variant="default"
                >
                  Switch to ETH
                </Button>
              )}
            </div>
          )}
        </Card>
        <Card className="flex-[2] h-full">
          <div className="flex w-full gap-2 justify-between">
            <Text variant="headline4" className="text-gray-500">
              Validators
            </Text>
            <Badge size="sm" variant="primary" className="h-fit">
              {cluster.data?.validatorCount}
            </Badge>
            <Spacer />
            <ValidatorsActionsMenu
              isLiquidated={Boolean(isLiquidated.data)}
              isSSVCluster={isMigrated}
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

          <ClusterValidatorsList className="min-h-96" />
        </Card>
      </div>
    </Container>
  );
};

Cluster.displayName = "Cluster";
