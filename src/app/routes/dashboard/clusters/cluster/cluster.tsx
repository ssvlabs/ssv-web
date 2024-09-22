import { ClusterValidatorsList } from "@/components/cluster/cluster-validators-list";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { ValidatorsActionsMenu } from "@/components/cluster/validators-actions-menu";
import { OperatorStatCard } from "@/components/operator/operator-stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Skeleton } from "@/components/ui/skeleton";
import { Spacer } from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { Tooltip } from "@/components/ui/tooltip";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useOperatorsUsability } from "@/hooks/keyshares/use-operators-usability";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";
import { PlusIcon } from "lucide-react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "@/hooks/account/use-account";

export const Cluster: FC = () => {
  const account = useAccount();

  const { clusterHash } = useClusterPageParams();

  const { cluster, isLiquidated, balance } = useClusterState(clusterHash!, {
    balance: { watch: true },
    isLiquidated: { watch: true },
  });

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

  const { data: runway } = useClusterRunway(clusterHash!);

  return (
    <Container variant="vertical" size="xl" className="h-full py-6">
      <NavigateBackBtn />

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
            {balance.isLoading ? (
              <Skeleton className="h-10 w-24 my-1" />
            ) : (
              <Text
                variant="headline1"
                className={cn({
                  "text-error-500": runway?.isAtRisk,
                })}
              >
                {formatSSV(balance.data || 0n)}
              </Text>
            )}
          </div>
          {Boolean(cluster.data?.validatorCount) && (
            <>
              <Divider />
              {balance.isLoading ? (
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
            <div className="flex gap-4 [&>*]:flex-1">
              <Button as={Link} to="deposit" size="xl">
                Deposit
              </Button>
              <Button as={Link} to="withdraw" size="xl" variant="secondary">
                Withdraw
              </Button>
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
            <ValidatorsActionsMenu isLiquidated={Boolean(isLiquidated.data)} />
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
