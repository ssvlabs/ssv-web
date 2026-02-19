import { type ComponentPropsWithoutRef, type FC } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@/components/ui/text";
import { BigNumberInput } from "@/components/ui/number-input";
import { formatUnits, parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useFocus } from "@/hooks/use-focus";
import { useRegisterOperatorContext } from "@/guard/register-operator-guards";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRates } from "@/hooks/use-rates";
import { currencyFormatter, ms } from "@/lib/utils/number";
import { Tooltip } from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";
import {
  useGetMaximumOperatorFee,
  useGetMinimumOperatorEthFee,
} from "@/lib/contract-interactions/hooks/getter";
import { getYearlyFee } from "@/lib/utils/operator";

export const SetOperatorFee: FC<ComponentPropsWithoutRef<"div">> = () => {
  const { isPrivate } = useRegisterOperatorContext();

  const navigate = useNavigate();
  const rates = useRates();

  const { data: minFee = 0n } = useGetMinimumOperatorEthFee({
    staleTime: ms(1, "days"),
  });

  const { data: maxFee = 0n } = useGetMaximumOperatorFee({
    staleTime: ms(1, "days"),
  });

  const minYearlyFee = getYearlyFee(minFee);
  const minYearlyFeeFormatted = getYearlyFee(minFee, { format: true });

  const maxYearlyFee = getYearlyFee(maxFee);
  const maxYearlyFeeFormatted = getYearlyFee(maxFee, { format: true });

  const ethRate = rates.data?.eth ?? 0;

  const form = useForm({
    mode: "all",
    defaultValues: {
      yearlyFee: useRegisterOperatorContext.state.yearlyFee ?? "",
    },
    resolver: zodResolver(
      z.object({
        yearlyFee: z.bigint().superRefine((value, ctx) => {
          if (value > maxYearlyFee) {
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Fee must be lower than ${maxYearlyFeeFormatted}`,
            });
          }
          if (isPrivate && value === parseEther("0")) return;

          if (value === parseEther("0"))
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Fee cannot be set to 0 while operator status is set to public. To set the fee to 0, switch the operator status to private in the previous step.`,
            });

          if (value >= parseEther("0") && value < minYearlyFee)
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Fee must be greater than ${minYearlyFeeFormatted}`,
            });
        }),
      }),
    ),
  });

  const submit = form.handleSubmit((values) => {
    useRegisterOperatorContext.state.yearlyFee = values.yearlyFee;
    navigate("../confirm-transaction");
  });

  useFocus("#register-operator-fee", { select: true });

  return (
    <Container variant="vertical" className="py-6">
      <NavigateBackBtn by="history" />
      <Form {...form}>
        <Card as="form" onSubmit={submit}>
          <CardHeader
            title="Set Operator Fee"
            description="The SSV Network utilizes ETH to facilitate payments from stakers to operators for maintaining their validators."
          />
          <Text variant="body-2-medium">
            Operators set their own fees, denominated in ETH, which are charged
            per 32 ETH of{" "}
            <Button
              as="a"
              href="https://docs.ssv.network/stakers/clusters/effective-balance"
              target="_blank"
              variant="link"
            >
              validator effective balance
            </Button>{" "}
            for each validator that selects them as an operator. As a result,
            operator earnings scale with the effective balance of the validators
            they manage.
          </Text>
          <Text variant="body-2-medium">
            Fees are presented as annual amounts, but in practice are paid to
            operators continuously as an ongoing process, per each passed block.
          </Text>
          <Text variant="body-2-medium">
            Your earnings are paid to your operator ETH balance and can be
            withdrawn to your wallet at any time.
          </Text>
          <Text variant="body-2-medium">
            Please note that you can adjust your fee (according to the{" "}
            <Button
              as="a"
              href="https://docs.ssv.network/operators/operator-onboarding/update-fee"
              target="_blank"
              variant="link"
            >
              limitations
            </Button>
            ) to align with market dynamics, such as competitiveness and changes
            in network conditions.
          </Text>

          <FormField
            control={form.control}
            name="yearlyFee"
            render={({ field, fieldState }) => (
              <FormItem>
                <Tooltip content="The yearly fee per 32 ETH validator unit">
                  <FormLabel className="flex items-center gap-1">
                    <Text>Annual fee</Text>
                    <FaCircleInfo className="size-4 text-gray-500" />
                  </FormLabel>
                </Tooltip>
                <FormControl>
                  <BigNumberInput
                    displayDecimals={7}
                    id="register-operator-fee"
                    value={field.value}
                    onChange={field.onChange}
                    max={maxYearlyFee}
                    rightSlot={
                      <div className="flex items-center gap-1 px-3">
                        <img
                          src="/images/networks/dark.svg"
                          className="size-5"
                          alt="ETH"
                        />
                        <Text variant="body-2-bold">ETH</Text>
                      </div>
                    }
                  />
                </FormControl>
                <Text variant="body-3-medium" className="text-gray-500">
                  {field.value
                    ? `~${currencyFormatter.format(ethRate * +formatUnits(field.value, 18))}`
                    : "~$0.00"}
                </Text>
                {fieldState.error?.message && (
                  <Alert variant="error">
                    <AlertDescription>
                      {fieldState.error?.message}
                    </AlertDescription>
                  </Alert>
                )}
                {isPrivate && form.watch("yearlyFee") === 0n && (
                  <Alert variant="warning">
                    <AlertDescription>
                      If you set your fee to 0 you will not be able to change it
                      in the future
                    </AlertDescription>
                  </Alert>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" size="xl">
            Next
          </Button>
        </Card>
      </Form>
    </Container>
  );
};

SetOperatorFee.displayName = "SetOperatorFee";
