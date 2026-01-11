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
import { BigNumberInput } from "@/components/ui/number-input";
import { Text } from "@/components/ui/text";
import { toast } from "@/components/ui/use-toast";
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
import { merge } from "lodash-es";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Collapse } from "react-collapse";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useLocation } from "react-router";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spacer } from "@/components/ui/spacer";
import { formatSSV } from "@/lib/utils/number";
import { cn } from "@/lib/utils/tw";

export type ReactivateClusterProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof ReactivateClusterProps> &
    ReactivateClusterProps
>;

const schema = z.object({
  selected: z.enum(["year", "half-year", "custom"]),
  custom: z.coerce.number().positive().min(1),
});

const periods: Record<
  Exclude<z.infer<typeof schema>["selected"], "custom">,
  number
> = {
  year: 366,
  "half-year": 182,
};

export const ReactivateCluster: FCProps = ({ ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useClusterPageParams();

  const cluster = useCluster();
  const operatorIds = useSelectedOperatorIds();
  const operators = useOperators(operatorIds);

  // Get effectiveBalance from state (passed from previous step)
  const effectiveBalanceFromState = location.state?.effectiveBalance as bigint | undefined;
  const effectiveBalance = effectiveBalanceFromState ?? (cluster.data?.effectiveBalance
    ? BigInt(cluster.data.effectiveBalance)
    : 0n);

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      custom: 365,
      selected: "year",
    },
    resolver: zodResolver(schema),
  });

  const values = form.watch();
  const days =
    values.selected === "custom" ? values.custom : periods[values.selected];

  const showLiquidationWarning = Boolean(
    days && days < globals.CLUSTER_VALIDITY_PERIOD_MINIMUM,
  );

  const customFundingCost = useFundingCost({
    fundingDays: values.custom,
    operators: operators.data ?? [],
    validatorsAmount: cluster.data?.validatorCount ?? 1,
    effectiveBalance,
  });

  const yearFundingCost = useFundingCost({
    fundingDays: periods.year,
    operators: operators.data ?? [],
    validatorsAmount: cluster.data?.validatorCount ?? 1,
    effectiveBalance,
  });

  const halfYearFundingCost = useFundingCost({
    fundingDays: periods["half-year"],
    operators: operators.data ?? [],
    validatorsAmount: cluster.data?.validatorCount ?? 1,
    effectiveBalance,
  });

  const computeFundingCost = useComputeFundingCost();

  const reactive = useReactivate();

  const submit = form.handleSubmit(async ({ selected, custom }) => {
    const days = selected === "custom" ? custom : periods[selected];
    const amount = await computeFundingCost.mutateAsync({
      fundingDays: days,
      operatorsFee: sumOperatorsFee(operators.data ?? []),
      validators: cluster.data?.validatorCount ?? 1,
      effectiveBalance,
    });

    return reactive.write(
      {
        amount: amount.total,
        operatorIds: bigintifyNumbers(operatorIds),
        cluster: formatClusterData(cluster.data),
      },
      amount.total,
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
      },),
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
          <Text variant="body-2-medium">
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
            name="selected"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-2 [&>*]:w-full"
                >
                  <FormLabel htmlFor="year">
                    <div className="flex items-center gap-3 border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <RadioGroupItem value="year" id="year" />
                      <Text variant="body-2-semibold">1 Year</Text>
                      <Spacer />
                      <Text variant="body-1-bold">
                        {formatSSV(yearFundingCost.data?.total ?? 0n)} SSV
                      </Text>
                    </div>
                  </FormLabel>
                  <FormLabel htmlFor="half-year">
                    <div className="flex items-center gap-3 border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <RadioGroupItem value="half-year" id="half-year" />
                      <Text variant="body-2-semibold">6 Months</Text>
                      <Spacer />
                      <Text variant="body-1-bold">
                        {formatSSV(halfYearFundingCost.data?.total ?? 0n)} SSV
                      </Text>
                    </div>
                  </FormLabel>
                  <FormLabel htmlFor="custom">
                    <div className="border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <div className="flex gap-3 items-center">
                        <RadioGroupItem value="custom" id="custom" />
                        <Text variant="body-2-semibold">Custom</Text>
                        <Spacer />
                        <Text variant="body-1-bold">
                          {values.selected === "custom"
                            ? formatSSV(customFundingCost.data?.total ?? 0n) +
                              " SSV"
                            : "-"}
                        </Text>
                      </div>
                      <div
                        className={cn(
                          "transition-all duration-100",
                          values.selected === "custom" ? "mt-4" : "mt-0",
                        )}
                      >
                        <Collapse isOpened={values.selected === "custom"}>
                          <FormField
                            control={form.control}
                            name="custom"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <BigNumberInput
                                    className="text-gray-800"
                                    value={BigInt(field.value)}
                                    onChange={(value) =>
                                      field.onChange(Number(value))
                                    }
                                    decimals={0}
                                    displayDecimals={0}
                                    max={BigInt(365 * 9999)}
                                    rightSlot={<>Days</>}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Collapse>
                      </div>
                    </div>
                  </FormLabel>
                </RadioGroup>
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
            effectiveBalance={effectiveBalance}
          />
            <Button
              isActionBtn
              isLoading={reactive.isPending}
              size="xl"
              type="submit"
            >
              Reactivate
            </Button>
        </Card>
      </Form>
    </Container>
  );
};

ReactivateCluster.displayName = "ReactivateCluster";
