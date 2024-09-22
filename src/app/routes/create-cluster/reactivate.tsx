import { ClusterFundingSummary } from "@/components/cluster/cluster-funding-summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loading } from "@/components/ui/Loading";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { NumberInput } from "@/components/ui/number-input";
import { Text } from "@/components/ui/text";
import { toast } from "@/components/ui/use-toast";
import { WithAllowance } from "@/components/with-allowance/with-allowance";
import { globals } from "@/config";
import { useSelectedOperatorIds } from "@/guard/register-validator-guard";
import {
  getClusterQueryOptions,
  useCluster,
} from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useOperators } from "@/hooks/operator/use-operators";
import {
  useComputeFundingCost,
  useFundingCost,
} from "@/hooks/use-compute-funding-cost";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useReactivate } from "@/lib/contract-interactions/write/use-reactivate";
import { setOptimisticData } from "@/lib/react-query";
import { bigintifyNumbers, stringifyBigints } from "@/lib/utils/bigint";
import { formatClusterData } from "@/lib/utils/cluster";
import { sumOperatorsFee } from "@/lib/utils/operator";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, merge } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Collapse } from "react-collapse";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";
import { z } from "zod";

export type ReactivateClusterProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ReactivateClusterProps> &
    ReactivateClusterProps
>;

const schema = z.object({
  days: z.coerce.number().positive().min(1),
});

export const ReactivateCluster: FCProps = ({ ...props }) => {
  const navigate = useNavigate();
  const params = useClusterPageParams();

  const cluster = useCluster();
  const operatorIds = useSelectedOperatorIds();
  const operators = useOperators(operatorIds);

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { days: 365 },
    resolver: zodResolver(schema),
  });

  const days = form.watch("days");

  const showLiquidationWarning =
    !isEmpty(days) && days < globals.CLUSTER_VALIDITY_PERIOD_MINIMUM;

  const computeFundingCost = useComputeFundingCost();
  const fundingCost = useFundingCost({
    operators: operators.data ?? [],
    validatorsAmount: cluster.data?.validatorCount ?? 1,
    fundingDays: days,
  });

  const reactive = useReactivate();

  const submit = form.handleSubmit(async ({ days }) => {
    const amount = await computeFundingCost.mutateAsync({
      fundingDays: days,
      operatorsFee: sumOperatorsFee(operators.data ?? []),
      validators: cluster.data?.validatorCount ?? 1,
    });

    return reactive.write(
      {
        amount: amount.total,
        operatorIds: bigintifyNumbers(operatorIds),
        cluster: formatClusterData(cluster.data),
      },
      withTransactionModal({
        onMined: ({ events }) => {
          const event = events.find(
            (event) => event.eventName === "ClusterReactivated",
          );

          event &&
            setOptimisticData(
              getClusterQueryOptions(params.clusterHash!).queryKey,
              (cluster) => {
                if (!cluster) return cluster;
                return merge(
                  {},
                  cluster,
                  stringifyBigints(event.args.cluster),
                  { isLiquidated: false },
                );
              },
            );

          toast({
            title: "Cluster reactivated",
            description: "Your cluster has been reactivated",
          });
          return () => navigate("..");
        },
      }),
    );
  });

  if (cluster.data && !cluster.data.isLiquidated)
    return <Navigate to={`/clusters/${cluster.data?.clusterId}`} replace />;

  if (operators.isPending) return <Loading />;

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn />
      <Form {...form}>
        <Card as="form" onSubmit={submit} {...props}>
          <Text variant="headline4">Reactivate Cluster</Text>
          <Text>
            Your cluster has been{" "}
            <Button
              as="a"
              href="https://docs.ssv.network/learn/stakers/clusters/reactivation"
              variant="link"
              target="_blank"
            >
              liquidated
            </Button>{" "}
            due to insufficient balance for its operational costs. To resume its
            operation, you must deposit sufficient funds required for its
            reactivation.{" "}
            <Button
              as="a"
              href="https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations"
              variant="link"
              target="_blank"
            >
              Learn more on liquidations
            </Button>
            .
          </Text>
          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days</FormLabel>
                <FormControl>
                  <NumberInput
                    value={BigInt(field.value)}
                    decimals={0}
                    max={36500n}
                    onChange={(value) => field.onChange(value.toString())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Collapse isOpened={showLiquidationWarning}>
            <Alert variant="warning">
              <AlertDescription>
                This period is low and could put your validator at risk. To
                avoid liquidation please input a longer period.{" "}
                <Button
                  as="a"
                  variant="link"
                  href="https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations"
                  target="_blank"
                >
                  Learn more on liquidations
                </Button>
              </AlertDescription>
            </Alert>
          </Collapse>
          <Divider />
          <ClusterFundingSummary
            operators={operators.data ?? []}
            validatorsAmount={cluster.data?.validatorCount ?? 1}
            fundingDays={days}
          />
          <WithAllowance amount={fundingCost.data?.total ?? 0n}>
            <Button
              isActionBtn
              isLoading={reactive.isPending}
              size="xl"
              type="submit"
            >
              Reactivate
            </Button>
          </WithAllowance>
        </Card>
      </Form>
    </Container>
  );
};

ReactivateCluster.displayName = "ReactivateCluster";
