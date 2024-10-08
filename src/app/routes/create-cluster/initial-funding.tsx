import {
  useComputeFundingCost,
  useFundingCost,
} from "@/hooks/use-compute-funding-cost";
import type { ComponentPropsWithoutRef, FC } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { globals } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumberInput } from "@/components/ui/number-input";
import { cn } from "@/lib/utils/tw";
import { Spacer } from "@/components/ui/spacer";
import { formatSSV } from "@/lib/utils/number";

export type InitialFundingProps = {
  // TODO: Add props or remove this type
};

type FCProps = FC<
  Omit<ComponentPropsWithoutRef<"div">, keyof InitialFundingProps> &
    InitialFundingProps
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

export const InitialFunding: FCProps = ({ ...props }) => {
  const navigate = useNavigate();

  const { state } = useRegisterValidatorContext;
  const { shares, fundingDays, selectedInitialFundingPeriod } =
    useRegisterValidatorContext();
  const operatorIds = useSelectedOperatorIds();

  const operators = useOperators(operatorIds);
  const operatorsFee = sumOperatorsFees(operators.data ?? []);

  const computeFundingCost = useComputeFundingCost();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      custom: fundingDays,
      selected: selectedInitialFundingPeriod,
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
    validatorsAmount: shares.length,
  });

  const yearFundingCost = useFundingCost({
    fundingDays: periods.year,
    operators: operators.data ?? [],
    validatorsAmount: shares.length,
  });

  const halfYearFundingCost = useFundingCost({
    fundingDays: periods["half-year"],
    operators: operators.data ?? [],
    validatorsAmount: shares.length,
  });

  const submit = form.handleSubmit(async ({ selected, custom }) => {
    const days = selected === "custom" ? custom : periods[selected];
    const cost = await computeFundingCost.mutateAsync({
      fundingDays: days,
      operatorsFee,
      validators: shares.length,
    });

    state.depositAmount = cost.total;
    state.fundingDays = days;
    state.selectedInitialFundingPeriod = selected;
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
          <Text variant="body-2-medium">
            The SSV amount you deposit will determine your validator operational
            runway (You can always manage it later by withdrawing or depositing
            more funds).
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
                                  <NumberInput
                                    className="text-gray-800"
                                    value={BigInt(field.value)}
                                    onChange={(value) =>
                                      field.onChange(Number(value))
                                    }
                                    decimals={0}
                                    max={BigInt(365 * 9999)}
                                    displayDecimals={0}
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
          {/* <FormField
            control={form.control}
            name="selected"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Radio
                </FormLabel>
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
          /> */}
          {/* <FormField
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
          /> */}
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
