import { useState, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NumberInput } from "@/components/ui/number-input";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { Divider } from "@/components/ui/divider";
import { isBigIntChanged, stringifyBigints } from "@/lib/utils/bigint";
import { formatSSV } from "@/lib/utils/number";
import { Checkbox } from "@/components/ui/checkbox";
import { useWithdrawClusterBalance } from "@/hooks/cluster/use-withdraw-cluster-balance";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { useNavigate } from "react-router-dom";
import { useLiquidateCluster } from "@/hooks/cluster/use-liquidate-cluster";
import { setOptimisticData } from "@/lib/react-query";
import { getClusterQueryOptions } from "@/hooks/cluster/use-cluster";
import { useActiveTransactionState } from "@/hooks/app/use-transaction-state";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";

const schema = z.object({
  amount: z.bigint().positive(),
});

export const WithdrawClusterBalance: FC = () => {
  const transaction = useActiveTransactionState();
  const navigate = useNavigate();
  const params = useClusterPageParams();

  const withdraw = useWithdrawClusterBalance(params.clusterHash!);
  const liquidate = useLiquidateCluster(params.clusterHash!);

  const { balance: clusterBalance, cluster } = useClusterState(
    params.clusterHash!,
    {
      balance: { watch: true },
    },
  );

  const [hasAgreed, setHasAgreed] = useState(false);

  const form = useForm({
    defaultValues: { amount: 0n },
    resolver: zodResolver(schema),
  });

  const amount = form.watch("amount");

  const clusterRunway = useClusterRunway(params.clusterHash!, {
    deltaBalance: -amount,
  });

  const isChanged = isBigIntChanged(0n, amount);
  const isLiquidating = clusterRunway.data?.runway === 0n;

  const showRiskCheckbox = isChanged && clusterRunway.data?.isAtRisk;
  const disabled = showRiskCheckbox ? !hasAgreed : false;

  const submit = form.handleSubmit(async (values) => {
    const options = withTransactionModal({
      onMined: async ({ events }) => {
        const event = events.find(
          (e) =>
            e.eventName === "ClusterWithdrawn" ||
            e.eventName === "ClusterLiquidated",
        );

        event &&
          setOptimisticData(
            getClusterQueryOptions(params.clusterHash!).queryKey,
            (cluster) => {
              if (!cluster) return cluster;
              return {
                ...cluster,
                ...stringifyBigints(event.args.cluster),
                isLiquidated: Boolean(
                  events.find((e) => e.eventName === "ClusterLiquidated"),
                ),
              };
            },
          );

        return () => navigate("..");
      },
    });

    if (isLiquidating) {
      liquidate.write(options);
    } else {
      withdraw.write(values, options);
    }
  });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn />
      <Card className="w-full gap-2">
        <Text variant="headline4" className="text-gray-500">
          Available Balance
        </Text>
        <Text variant="headline1">
          {formatSSV(clusterBalance.data ?? 0n)} SSV
        </Text>
      </Card>
      <Form {...form}>
        <Card as="form" className="w-full" onSubmit={submit}>
          <Text variant="headline4" className="text-gray-500">
            Withdraw
          </Text>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumberInput
                    placeholder="0"
                    max={clusterBalance.data ?? 0n}
                    value={field.value}
                    onChange={field.onChange}
                    rightSlot={
                      <div className="flex items-center gap-2 px-2">
                        <Button
                          variant="secondary"
                          className="px-5"
                          size="sm"
                          onClick={() => {
                            form.setValue("amount", clusterBalance.data ?? 0n, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          Max
                        </Button>
                        <Text variant="body-1-bold">SSV</Text>
                      </div>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {Boolean(cluster.data?.validatorCount) && (
            <>
              <Divider />
              <EstimatedOperationalRunway deltaBalance={-amount} />
              <Divider />
            </>
          )}

          {showRiskCheckbox && (
            <label className="flex items-center gap-2" id="understand">
              <Checkbox
                checked={hasAgreed}
                id="understand"
                className="border border-gray-500"
                onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
              />
              <Text variant="body-2-semibold">
                {isLiquidating
                  ? "I understand that withdrawing this amount will liquidate my cluster."
                  : "I understand the risks of having my cluster liquidated."}
              </Text>
            </label>
          )}
          <Button
            type="submit"
            size="xl"
            disabled={!isChanged || disabled}
            isLoading={transaction.isPending}
            variant={isLiquidating ? "destructive" : "default"}
          >
            {isLiquidating ? "Liquidate" : "Withdraw"}
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

WithdrawClusterBalance.displayName = "WithdrawClusterBalance";
