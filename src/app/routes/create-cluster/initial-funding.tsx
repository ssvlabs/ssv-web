import { useComputeFundingCost } from "@/hooks/use-compute-funding-cost";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { globals } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash-es";
import { Collapse } from "react-collapse";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import {
  useRegisterValidatorContext,
  useSelectedOperatorIds,
} from "@/guard/register-validator-guard";
import { useOperators } from "@/hooks/operator/use-operators";
import { sumOperatorsFees } from "@/lib/utils/operator";
import { useNavigate } from "react-router";
import { ClusterFundingSummary } from "@/components/cluster/cluster-funding-summary";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { NumberInput } from "@/components/ui/number-input";

export type InitialFundingProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof InitialFundingProps> &
    InitialFundingProps
>;

const schema = z.object({
  days: z.coerce.number().positive().min(1),
});

export const InitialFunding: FCProps = ({ ...props }) => {
  const navigate = useNavigate();

  const { state } = useRegisterValidatorContext;
  const { shares, fundingDays } = useRegisterValidatorContext();
  const operatorIds = useSelectedOperatorIds();

  const operators = useOperators(operatorIds);
  const operatorsFee = sumOperatorsFees(operators.data ?? []);

  const computeFundingCost = useComputeFundingCost();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { days: fundingDays },
    resolver: zodResolver(schema),
  });

  const days = form.watch("days");
  const showLiquidationWarning =
    !isEmpty(days) && days < globals.CLUSTER_VALIDITY_PERIOD_MINIMUM;

  const submit = form.handleSubmit(async ({ days }) => {
    const cost = await computeFundingCost.mutateAsync({
      fundingDays: days,
      operatorsFee,
      validators: shares.length,
    });

    state.depositAmount = cost.total;
    state.fundingDays = days;
    navigate("../balance-warning");
  });

  if (operators.isPending) {
    return <Spinner />;
  }

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Form {...form}>
        <Card as="form" onSubmit={submit} {...props}>
          <Text variant="headline4">Select your validator funding period</Text>
          <Text>
            The SSV amount you deposit will determine your validator operational
            runway (You can always manage it later by withdrawing or depositing
            more funds).
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
                    onChange={(value) => field.onChange(Number(value))}
                    decimals={0}
                    max={BigInt(365 * 9999)}
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
              <div className="flex items-center gap-4">
                <div></div>
              </div>
            </Alert>
          </Collapse>
          <ClusterFundingSummary
            operators={operators.data ?? []}
            validatorsAmount={shares.length}
            fundingDays={days}
          />
          <Button size="xl" type="submit">
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

InitialFunding.displayName = "Funding";
