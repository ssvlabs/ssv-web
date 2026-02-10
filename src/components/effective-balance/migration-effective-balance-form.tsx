import { Container } from "@/components/ui/container.tsx";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Form } from "@/components/ui/form";
import { type FC, useEffect, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BigNumberInput } from "@/components/ui/number-input";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import { numberFormatter } from "@/lib/utils/number";
import type { LinkProps } from "react-router-dom";
import { ExistingClusterValidatorsBreakdown } from "@/components/effective-balance/existing-cluster-validators-breakdown";

export type EffectiveBalanceFormProps = {
  totalEffectiveBalance: number;
  maxEffectiveBalance: number;
  onNext: (effectiveBalance: bigint) => void;
  clusterHash: string;
  isLoading?: boolean;
  backBy?: "path" | "history";
  backTo?: string;
  backState?: LinkProps["state"];
  backPersistSearch?: boolean;
  showDetailedErrors?: boolean;
};

export const MigrationEffectiveBalanceForm: FC<EffectiveBalanceFormProps> = ({
  onNext,
  isLoading = false,
  backBy = "path",
  backTo = "..",
  backState,
  totalEffectiveBalance,
  maxEffectiveBalance,
  backPersistSearch = false,
  showDetailedErrors = false,
  clusterHash,
}) => {
  const schema = useMemo(
    () =>
      z.object({
        totalEffectiveBalance: z
          .number()
          .positive({ message: "Balance must be greater than 0" })
          .min(totalEffectiveBalance),
        // .max(maxEffectiveBalance),
      }),
    [totalEffectiveBalance],
  );

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      totalEffectiveBalance,
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    form.setValue("totalEffectiveBalance", totalEffectiveBalance);
  }, [form, totalEffectiveBalance]);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const confirmId = useId();

  const balanceValue = form.watch("totalEffectiveBalance");
  console.log("balanceValue:", balanceValue);

  const balanceError = form.formState.errors.totalEffectiveBalance?.type;
  const isLowBalance = balanceError === "too_small";
  const isHighBalance = balanceError === "too_big";

  const handleNext = () => {
    onNext(BigInt(balanceValue));
  };

  const backButtonProps =
    backBy === "history"
      ? ({ by: "history" } as const)
      : ({
          by: "path",
          to: backTo,
          state: backState,
          persistSearch: backPersistSearch,
        } as const);

  return (
    <Container variant="vertical" size="xl" className="py-6 h-full">
      <NavigateBackBtn {...backButtonProps} />
      <div className="flex w-full gap-6">
        <Card className="w-full flex-1 flex flex-col gap-6 p-8 bg-white rounded-2xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Text variant="headline4">Enter Total Effective Balance</Text>
              <Tooltip content="Total effective balance across all validators.">
                <FaCircleInfo className="size-3.5 text-gray-400" />
              </Tooltip>
            </div>
            <Text variant="body-2-medium" className="text-gray-600">
              To accurately estimate your cluster’s fees and runway, please
              enter the total effective balance (in ETH) of all validators you
              are onboarding.
            </Text>
          </div>

          <Form {...form}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Text
                  as="label"
                  htmlFor="total-effective-balance"
                  variant="body-3-semibold"
                  className="text-gray-500"
                >
                  Total Effective Balance
                </Text>
                <Tooltip content="Sum of validator effective balances in ETH.">
                  <FaCircleInfo className="size-3 text-gray-400" />
                </Tooltip>
              </div>
              <BigNumberInput
                id="total-effective-balance"
                value={BigInt(balanceValue)}
                onChange={(value) => {
                  form.setValue("totalEffectiveBalance", Number(value), {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
                className="h-[64px] border-primary-200 bg-white focus-within:border-primary-500"
                placeholder="0"
                rightSlot={
                  <div className="flex items-center gap-2 pr-1 text-gray-500">
                    <img
                      src="/images/networks/dark.svg"
                      alt="ETH"
                      className="size-4"
                    />
                    <Text variant="body-2-medium" className="text-gray-500">
                      ETH
                    </Text>
                  </div>
                }
                inputProps={{
                  className:
                    "text-2xl font-semibold text-gray-800 placeholder:text-gray-400",
                }}
                decimals={0}
                displayDecimals={0}
              />
            </div>
          </Form>

          <Alert variant="warning" className="rounded-lg text-gray-700">
            <AlertDescription className="text-sm font-medium">
              <span className="font-semibold">Cluster Liquidation Warning</span>
              <br />
              If the actual Effective Balance reported by Oracles is higher than
              the amount set here, your operational burn rate will increase.
              This risks an insufficient runway and possible cluster
              liquidation.
            </AlertDescription>
          </Alert>

          {isLowBalance && (
            <Alert variant="error" className="rounded-lg">
              <AlertDescription className="text-sm font-medium">
                {showDetailedErrors ? (
                  <>
                    The entered total projected balance is lower than our
                    estimation ({numberFormatter.format(totalEffectiveBalance)}{" "}
                    ETH). This may lead to an insufficient runway. Please
                    double-check the balance entered.
                  </>
                ) : (
                  <>
                    The entered total projected balance is lower than our
                    estimation. This may lead to an insufficient runway. Please
                    double-check the balance entered.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {isHighBalance && (
            <Alert variant="error" className="rounded-lg">
              <AlertDescription className="text-sm font-medium">
                {showDetailedErrors ? (
                  <>
                    The entered total projected balance is higher than the max
                    EB per validator (
                    {numberFormatter.format(maxEffectiveBalance)} ETH). Please
                    double-check the balance entered.
                  </>
                ) : (
                  <>
                    The entered total projected balance is higher than the max
                    EB per validator. Please double-check the balance entered.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          <label
            htmlFor={confirmId}
            className="flex items-start gap-3 cursor-pointer"
          >
            <Checkbox
              id={confirmId}
              checked={isConfirmed}
              onCheckedChange={(checked) => {
                form.trigger();
                return setIsConfirmed(checked === true);
              }}
              className="mt-0.5"
            />
            <Text as="span" variant="body-3-medium" className="text-gray-700">
              I confirm that the total projected balance is accurate, and I
              understand that an insufficient funding balance based on this
              amount could lead to my cluster being liquidated.
            </Text>
          </label>

          <Button
            size="xl"
            width="full"
            className="font-semibold"
            onClick={handleNext}
            disabled={!isConfirmed || !form.formState.isValid}
            isLoading={isLoading}
          >
            Next
          </Button>
        </Card>

        <ExistingClusterValidatorsBreakdown
          clusterHash={clusterHash}
          totalEffectiveBalance={totalEffectiveBalance}
        />
      </div>
    </Container>
  );
};
