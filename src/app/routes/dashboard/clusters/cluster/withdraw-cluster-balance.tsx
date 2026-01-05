import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { BigNumberInput } from "@/components/ui/number-input";
import { Text } from "@/components/ui/text";
import { getClusterQueryOptions } from "@/hooks/cluster/use-cluster";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterState } from "@/hooks/cluster/use-cluster-state";
import { useLiquidateCluster } from "@/hooks/cluster/use-liquidate-cluster";
import { useWithdrawClusterBalance } from "@/hooks/cluster/use-withdraw-cluster-balance";
import { withTransactionModal } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { setOptimisticData } from "@/lib/react-query";
import { isBigIntChanged, stringifyBigints } from "@/lib/utils/bigint";
import { formatSSV } from "@/lib/utils/number";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  amount: z.bigint().positive(),
});

export const WithdrawClusterBalance: FC = () => {
  const navigate = useNavigate();
  const params = useClusterPageParams();

  const withdraw = useWithdrawClusterBalance(params.clusterHash!);
  const liquidate = useLiquidateCluster(params.clusterHash!);

  const { balanceETH, balanceSSV, cluster } = useClusterState(
    params.clusterHash!,
    {
      balance: { watch: true },
    },
  );

  const isMigrated = cluster.data?.migrated;
  const symbol = isMigrated ? "ETH" : "SSV";
  const clusterBalance = isMigrated
    ? balanceETH.data ?? 0n
    : balanceSSV.data ?? 0n;

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
          {formatSSV(clusterBalance)} {symbol}
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
                  <BigNumberInput
                    placeholder="0"
                    max={clusterBalance}
                    value={field.value}
                    onChange={field.onChange}
                    render={(props, ref) => (
                      <div className="flex flex-col pl-6 pr-5 py-4 gap-3 rounded-xl border border-gray-300 bg-gray-200">
                        <div className="flex h-14 items-center gap-5">
                          <input
                            placeholder="0"
                            className="w-full h-full border outline-none flex-1 text-[28px] font-medium border-none bg-transparent"
                            {...props}
                            ref={ref}
                          />
                          <Button
                            size="lg"
                            variant="secondary"
                            className="font-semibold px-4"
                            onClick={() =>
                              form.setValue("amount", clusterBalance, {
                                shouldValidate: true,
                              })
                            }
                          >
                            MAX
                          </Button>
                          <span className="text-[28px] font-medium">
                            {" "}
                            {symbol}
                          </span>
                        </div>
                      </div>
                    )}
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
            isLoading={liquidate.isPending || withdraw.isPending}
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
