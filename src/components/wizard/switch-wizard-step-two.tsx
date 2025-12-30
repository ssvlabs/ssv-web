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
import { Text } from "@/components/ui/text";
import { Container } from "@/components/ui/container";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BigNumberInput } from "@/components/ui/number-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tw";
import { Spacer } from "@/components/ui/spacer";
import type { Operator } from "@/types/api";
import { currencyFormatter, ethFormatter } from "@/lib/utils/number";
import { useRates } from "@/hooks/use-rates";
import {
  computeDailyAmount,
  computeLiquidationCollateralCostPerValidator,
} from "@/lib/utils/keystore";
import { useSsvNetworkFee } from "@/hooks/use-ssv-network-fee";
import { formatUnits } from "viem";
import type { SwitchWizardStepThreeState } from "./switch-wizard-types";

type SwitchWizardStepTwoProps = {
  onNext: (state: SwitchWizardStepThreeState) => void;
  onBack?: () => void;
  backButtonLabel?: string;
  navigateRoutePath?: string;
  operators?: Pick<Operator, "id" | "name" | "logo" | "fee" | "eth_fee">[];
  validatorsAmount?: number;
  effectiveBalance?: number;
  currentRunwayDays?: number;
};

const schema = z.object({
  selected: z.enum(["current", "half-year", "year", "custom"]),
  custom: z.coerce.number().positive().min(1),
});

const periods: Record<
  Exclude<z.infer<typeof schema>["selected"], "custom">,
  number
> = {
  current: 0,
  "half-year": 182,
  year: 365,
};

export const SwitchWizardStepTwo = ({
  onNext,
  onBack,
  backButtonLabel = "Back",
  navigateRoutePath,
  operators = [],
  validatorsAmount = 1,
  effectiveBalance,
  currentRunwayDays = 0,
}: SwitchWizardStepTwoProps) => {
  const rates = useRates();
  const networkFees = useSsvNetworkFee();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      custom: 182,
      selected: "current",
    },
    resolver: zodResolver(schema),
  });

  const values = form.watch();
  const selectedDays =
    values.selected === "custom"
      ? values.custom
      : values.selected === "current"
        ? currentRunwayDays
        : periods[values.selected];

  const operatorsFee = operators.reduce(
    (sum, operator) => sum + BigInt(operator.eth_fee || "0"),
    0n,
  );

  const effectiveBalanceValue = effectiveBalance ?? 0;
  const ethRate = rates.data?.eth ?? 0;

  const getCostsForDays = (days: number) => {
    if (!networkFees.isSuccess || days <= 0) return null;
    const networkFee = networkFees.ssvNetworkFee.data ?? 0n;
    const liquidationThreshold =
      networkFees.liquidationThresholdPeriod.data ?? 0n;
    const minimumLiquidationCollateral =
      networkFees.minimumLiquidationCollateral.data ?? 0n;

    const operatorsCost = computeDailyAmount(operatorsFee, days);
    const networkCost = computeDailyAmount(networkFee, days);
    const liquidationCost = computeLiquidationCollateralCostPerValidator({
      networkFee,
      operatorsFee,
      liquidationCollateralPeriod: liquidationThreshold,
      minimumLiquidationCollateral,
      validators: BigInt(validatorsAmount || 1),
    });

    const operatorsPerEth = Number(formatUnits(operatorsCost, 18)) / 32;
    const networkPerEth = Number(formatUnits(networkCost, 18)) / 32;
    const liquidationPerEth = Number(formatUnits(liquidationCost, 18)) / 32;

    const operatorsSubtotal = operatorsPerEth * effectiveBalanceValue;
    const networkSubtotal = networkPerEth * effectiveBalanceValue;
    const liquidationSubtotal = liquidationPerEth * effectiveBalanceValue;
    const totalDeposit =
      operatorsSubtotal + networkSubtotal + liquidationSubtotal;

    return {
      operatorsPerEth,
      networkPerEth,
      liquidationPerEth,
      operatorsSubtotal,
      networkSubtotal,
      liquidationSubtotal,
      totalDeposit,
    };
  };

  const selectedCosts = getCostsForDays(selectedDays);
  const currentCosts = getCostsForDays(currentRunwayDays);
  const halfYearCosts = getCostsForDays(periods["half-year"]);
  const yearCosts = getCostsForDays(periods.year);
  const customCosts = getCostsForDays(values.custom);

  const formatEth = (value?: number) =>
    value !== undefined ? `${ethFormatter.format(value)} ETH` : "-";

  const formatUsd = (value?: number) =>
    value !== undefined ? `~${currencyFormatter.format(ethRate * value)}` : "";

  const submit = form.handleSubmit(() => {
    onNext({
      fundingDays: selectedDays,
      effectiveBalance: effectiveBalanceValue,
      fundingSummary: selectedCosts
        ? {
            operatorsPerEth: selectedCosts.operatorsPerEth,
            networkPerEth: selectedCosts.networkPerEth,
            liquidationPerEth: selectedCosts.liquidationPerEth,
            operatorsSubtotal: selectedCosts.operatorsSubtotal,
            networkSubtotal: selectedCosts.networkSubtotal,
            liquidationSubtotal: selectedCosts.liquidationSubtotal,
          }
        : undefined,
      totalDeposit: selectedCosts?.totalDeposit,
    });
  });

  return (
    <Container
      variant="vertical"
      className="py-6"
      backButtonLabel={backButtonLabel}
      navigateRoutePath={navigateRoutePath}
      onBackButtonClick={onBack}
    >
      <Form {...form}>
        <Card
          as="form"
          onSubmit={submit}
          variant="unstyled"
          className="w-full flex flex-col gap-5 p-8 bg-white rounded-2xl"
        >
          <div className="flex flex-col gap-4 items-start">
            <Text variant="headline4">
              Select your validator funding period
            </Text>
            <Text variant="body-2-medium" className="text-gray-700">
              The ETH amount you deposit will determine your validator
              operational runway (You can always manage it later by withdrawing
              or depositing more funds).
            </Text>
          </div>

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
                  <FormLabel htmlFor="current">
                    <div className="flex items-center gap-3 border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <RadioGroupItem value="current" id="current" />
                      <div className="flex flex-col gap-1">
                        <Text variant="body-2-semibold">Current Period</Text>
                        <Text variant="body-3-medium" className="text-gray-500">
                          {currentRunwayDays > 0
                            ? `${currentRunwayDays} Days`
                            : "-"}
                        </Text>
                      </div>
                      <Spacer />
                      <div className="flex flex-col items-end">
                        <Text variant="body-1-bold">
                          {formatEth(currentCosts?.totalDeposit)}
                        </Text>
                        <Text variant="body-3-medium" className="text-gray-500">
                          {formatUsd(currentCosts?.totalDeposit)}
                        </Text>
                      </div>
                    </div>
                  </FormLabel>

                  <FormLabel htmlFor="half-year">
                    <div className="flex items-center gap-3 border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <RadioGroupItem value="half-year" id="half-year" />
                      <Text variant="body-2-semibold">6 Months</Text>
                      <Spacer />
                      <div className="flex flex-col items-end">
                        <Text variant="body-1-bold">
                          {formatEth(halfYearCosts?.totalDeposit)}
                        </Text>
                        <Text variant="body-3-medium" className="text-gray-500">
                          {formatUsd(halfYearCosts?.totalDeposit)}
                        </Text>
                      </div>
                    </div>
                  </FormLabel>

                  <FormLabel htmlFor="year">
                    <div className="flex items-center gap-3 border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <RadioGroupItem value="year" id="year" />
                      <Text variant="body-2-semibold">1 Year</Text>
                      <Spacer />
                      <div className="flex flex-col items-end">
                        <Text variant="body-1-bold">
                          {formatEth(yearCosts?.totalDeposit)}
                        </Text>
                        <Text variant="body-3-medium" className="text-gray-500">
                          {formatUsd(yearCosts?.totalDeposit)}
                        </Text>
                      </div>
                    </div>
                  </FormLabel>

                  <FormLabel htmlFor="custom">
                    <div className="border border-gray-400 rounded-lg py-[18px] px-6 outline outline-[4px] outline-none outline-offset-0 has-[input:checked]:border-primary-500 has-[input:checked]:outline-primary-100">
                      <div className="flex gap-3 items-center">
                        <RadioGroupItem value="custom" id="custom" />
                        <Text variant="body-2-semibold">Custom Period</Text>
                        <Spacer />
                        <div className="flex flex-col items-end">
                          <Text variant="body-1-bold">
                            {values.selected === "custom"
                              ? formatEth(customCosts?.totalDeposit)
                              : "-"}
                          </Text>
                          <Text
                            variant="body-3-medium"
                            className="text-gray-500"
                          >
                            {values.selected === "custom"
                              ? formatUsd(customCosts?.totalDeposit)
                              : ""}
                          </Text>
                        </div>
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
                                    className="text-gray-800 border border-gray-400 rounded-lg px-4 py-2"
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

          <div className="flex flex-col gap-2">
            <div
              className="grid gap-2 gap-x-8"
              style={{ gridTemplateColumns: "1fr auto auto auto" }}
            >
              <Text variant="body-3-semibold" className="text-gray-500">
                Funding Summary
              </Text>
              <Text
                variant="body-3-semibold"
                className="text-gray-500 text-right"
              >
                Fee ({selectedDays} Days)
              </Text>
              <Text
                variant="body-3-semibold"
                className="text-gray-500 text-right"
              >
                Effective Balance
              </Text>
              <Text
                variant="body-3-semibold"
                className="text-gray-500 text-right"
              >
                Subtotal
              </Text>

              <Text variant="body-2-medium">Operators fee</Text>
              <Text variant="body-2-medium" className="text-right">
                {selectedCosts
                  ? `${ethFormatter.format(selectedCosts.operatorsPerEth)} ETH`
                  : "-"}
              </Text>
              <Text variant="body-2-medium" className="text-right">
                {effectiveBalanceValue
                  ? `${ethFormatter.format(effectiveBalanceValue)} ETH`
                  : "-"}
              </Text>
              <Text variant="body-2-medium" className="text-right">
                {selectedCosts
                  ? `${ethFormatter.format(selectedCosts.operatorsSubtotal)} ETH`
                  : "-"}
              </Text>

              <Text variant="body-2-medium">Network fee</Text>
              <Text variant="body-2-medium" className="text-right">
                {selectedCosts
                  ? `${ethFormatter.format(selectedCosts.networkPerEth)} ETH`
                  : "-"}
              </Text>
              <Text variant="body-2-medium" className="text-right">
                {effectiveBalanceValue
                  ? `${ethFormatter.format(effectiveBalanceValue)} ETH`
                  : "-"}
              </Text>
              <Text variant="body-2-medium" className="text-right">
                {selectedCosts
                  ? `${ethFormatter.format(selectedCosts.networkSubtotal)} ETH`
                  : "-"}
              </Text>

              <div className="flex gap-2 items-center">
                <Text variant="body-2-medium">Liquidation collateral</Text>
                {/* Info icon placeholder */}
              </div>
              <Text variant="body-2-medium" className="text-right">
                {selectedCosts
                  ? `${ethFormatter.format(selectedCosts.liquidationPerEth)} ETH`
                  : "-"}
              </Text>
              <Text variant="body-2-medium" className="text-right">
                {effectiveBalanceValue
                  ? `${ethFormatter.format(effectiveBalanceValue)} ETH`
                  : "-"}
              </Text>
              <Text variant="body-2-medium" className="text-right">
                {selectedCosts
                  ? `${ethFormatter.format(
                      selectedCosts.liquidationSubtotal,
                    )} ETH`
                  : "-"}
              </Text>
            </div>

            <div className="border-t border-gray-300 my-2" />

            <div className="flex items-start justify-between">
              <Text variant="body-2-medium">Total</Text>
              <div className="flex flex-col items-end">
                <Text variant="headline4">
                  {selectedCosts
                    ? `${ethFormatter.format(selectedCosts.totalDeposit)} ETH`
                    : "-"}
                </Text>
                <Text variant="body-3-medium" className="text-gray-500">
                  {selectedCosts
                    ? `~${currencyFormatter.format(
                        ethRate * selectedCosts.totalDeposit,
                      )}`
                    : ""}
                </Text>
              </div>
            </div>
          </div>

          <Button
            size="xl"
            width="full"
            type="submit"
            className="font-semibold"
          >
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};
