import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { isBigIntChanged } from "@/lib/utils/bigint";
import { mergeClusterSnapshot } from "@/lib/utils/cluster";
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
  const isSsvCluster = !isMigrated;
  const symbol = isMigrated ? "ETH" : "SSV";
  const clusterBalance = isMigrated
    ? balanceETH.data ?? 0n
    : balanceSSV.data ?? 0n;

  const [hasAgreed, setHasAgreed] = useState(false);

  const form = useForm({
    defaultValues: { amount: isSsvCluster ? clusterBalance : 0n },
    resolver: zodResolver(schema),
  });

  const amount = form.watch("amount");

  const clusterRunway = useClusterRunway(params.clusterHash!, {
    deltaBalance: -amount,
  });

  const isChanged = isBigIntChanged(0n, amount);
  const isLiquidating = clusterRunway.data?.runway === 0n;
  const shouldLiquidate = isSsvCluster || isLiquidating;

  const showRiskCheckbox =
    isSsvCluster || (isChanged && clusterRunway.data?.isAtRisk);
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

              return mergeClusterSnapshot(cluster, event.args.cluster, {
                isLiquidated: Boolean(
                  events.find((e) => e.eventName === "ClusterLiquidated"),
                ),
              });
            },
          );

        return () => navigate("..");
      },
    });

    if (shouldLiquidate) {
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
                    readOnly={isSsvCluster}
                    render={(props, ref) => (
                      <div className="flex flex-col pl-6 pr-5 py-4 gap-3 rounded-xl border border-gray-300 bg-gray-200">
                        <div className="flex h-14 items-center gap-5">
                          <input
                            placeholder="0"
                            className="w-full h-full border outline-none flex-1 text-[28px] font-medium border-none bg-transparent"
                            {...props}
                            ref={ref}
                            readOnly={isSsvCluster}
                          />
                          {!isSsvCluster && (
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
                          )}
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
              <EstimatedOperationalRunway
                deltaBalance={-amount}
                withAlerts={!isSsvCluster}
              />
              <Divider />
            </>
          )}

          {isSsvCluster && (
            <Alert variant="warning">
              <AlertDescription className="flex flex-col gap-4">
                <p>
                  Withdrawing from an SSV cluster is full-withdrawal only
                  (partial withdrawals aren't allowed). Proceeding will withdraw
                  the entire cluster balance and liquidate your cluster, which
                  will result in inactivation (
                  <Button
                    variant="link"
                    as="a"
                    target="_blank"
                    href="https://launchpad.ethereum.org/en/faq#responsibilities"
                  >
                    penalties on the blockchain
                  </Button>
                  ) of your validators, as they will no longer be operated by
                  the network.
                </p>
                <Button
                  variant="link"
                  as="a"
                  target="_blank"
                  href="https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations"
                >
                  Read more on liquidation
                </Button>
              </AlertDescription>
            </Alert>
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
                {shouldLiquidate
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
            variant={isLiquidating && !isSsvCluster ? "destructive" : "default"}
          >
            {isSsvCluster
              ? "Withdraw & Liquidate"
              : isLiquidating
                ? "Liquidate"
                : "Withdraw"}
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

WithdrawClusterBalance.displayName = "WithdrawClusterBalance";
