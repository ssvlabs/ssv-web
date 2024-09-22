import { type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { EstimatedOperationalRunway } from "@/components/cluster/estimated-operational-runway";
import { Divider } from "@/components/ui/divider";
import { ClusterBalance } from "@/components/cluster/cluster-balance";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { useClusterRunway } from "@/hooks/cluster/use-cluster-runway";
import { useClusterPageParams } from "@/hooks/cluster/use-cluster-page-params";
import { EstimatedOperationalRunwayAlert } from "@/components/cluster/estimated-operational-runway-alert";
import { UnmountClosed } from "react-collapse";
import { useRegisterValidatorContext } from "@/guard/register-validator-guard";
import { useSSVBalance } from "@/hooks/use-ssv-balance";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
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
import { cn } from "@/lib/utils/tw";
import { useNavigate } from "react-router";

const schema = z.object({
  depositAmount: z.bigint().min(0n),
  topUp: z.boolean(),
});

export const AdditionalFunding: FC = () => {
  const navigate = useNavigate();
  const params = useClusterPageParams();
  const { data: ssvBalance } = useSSVBalance();

  const context = useRegisterValidatorContext();
  const deltaValidators = BigInt(context.shares.length);

  const form = useForm({
    defaultValues: { depositAmount: context.depositAmount, topUp: true },
    resolver: zodResolver(schema),
  });

  const { depositAmount, topUp } = form.watch();

  const { data: clusterRunway } = useClusterRunway(params.clusterHash!, {
    deltaBalance: topUp ? depositAmount : 0n,
    deltaValidators,
  });

  const submit = form.handleSubmit((data) => {
    useRegisterValidatorContext.state.depositAmount = data.topUp
      ? data.depositAmount
      : 0n;
    navigate("../balance-warning");
  });

  return (
    <Container variant="vertical" className="p-6">
      <NavigateBackBtn by="history" />
      <Form {...form}>
        <Card as="form" onSubmit={submit}>
          <Text variant="headline4">Select your validator funding period</Text>
          <Text>
            Adding a new validator increases your operational costs and
            decreases the cluster's operational runway.
          </Text>
          <Text variant="headline4">
            Would you like to top - up your balance?
          </Text>
          <Card className="rounded-xl bg-gray-200 w-full border border-gray-300">
            <ClusterBalance deltaBalance={topUp ? depositAmount : 0n} />
            <Divider />
            <EstimatedOperationalRunway
              withAlerts={false}
              deltaValidators={deltaValidators}
              deltaBalance={topUp ? depositAmount : 0n}
            />
          </Card>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="topUp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      <Card
                        as="label"
                        htmlFor="current-balance"
                        className={cn(
                          "rounded-xl flex items-start w-full border cursor-pointer px-6 py-4",
                          !topUp ? "border-primary-500" : "border-gray-300",
                        )}
                      >
                        <div className="flex gap-2">
                          <input
                            id="current-balance"
                            type="radio"
                            checked={!field.value}
                            onChange={() => field.onChange(false)}
                          />
                          <Text variant="body-1-medium">
                            No - use current balance
                          </Text>
                        </div>
                      </Card>
                      <Card
                        as="label"
                        htmlFor="top-up-balance"
                        className={cn(
                          "rounded-xl flex items-start w-full border cursor-pointer px-6 py-4",
                          topUp ? "border-primary-500" : "border-gray-300",
                        )}
                        onClick={() => field.onChange(true)}
                      >
                        <div className="flex gap-2">
                          <input
                            id="top-up-balance"
                            type="radio"
                            checked={field.value}
                            onChange={() => field.onChange(true)}
                          />
                          <Text variant="body-1-medium">
                            Yes - deposit additional funds
                          </Text>
                        </div>
                        <FormField
                          control={form.control}
                          name="depositAmount"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <NumberInput
                                  value={field.value}
                                  max={ssvBalance?.value ?? 0n}
                                  onChange={field.onChange}
                                  rightSlot={
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        className="h-auto py-1.5"
                                        variant="subtle"
                                        onClick={() =>
                                          form.setValue(
                                            "depositAmount",
                                            ssvBalance?.value ?? 0n,
                                          )
                                        }
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
                      </Card>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <UnmountClosed isOpened={Boolean(clusterRunway?.isAtRisk)}>
            <EstimatedOperationalRunwayAlert
              isLiquidated={false}
              isAtRisk={Boolean(clusterRunway?.isAtRisk)}
              isWithdrawing={false}
              hasDeltaValidators={true}
              runway={clusterRunway?.runway || 0n}
            />
          </UnmountClosed>
          <Button type="submit" size="xl" disabled={clusterRunway?.isAtRisk}>
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

AdditionalFunding.displayName = "AdditionalFunding";
