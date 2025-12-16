import { type FC, type ComponentPropsWithoutRef } from "react";
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
import { globals } from "@/config";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { NavigateBackBtn } from "@/components/ui/navigate-back-btn";
import { useFocus } from "@/hooks/use-focus";
import { useRegisterOperatorContext } from "@/guard/register-operator-guards";
import { Alert, AlertDescription } from "@/components/ui/alert";

const minimumFee =
  globals.BLOCKS_PER_YEAR * globals.MINIMUM_OPERATOR_FEE_PER_BLOCK;

export const SetOperatorFee: FC<ComponentPropsWithoutRef<"div">> = () => {
  const navigate = useNavigate();
  const { isPrivate } = useRegisterOperatorContext();

  const form = useForm({
    mode: "all",
    defaultValues: {
      yearlyFee: useRegisterOperatorContext.state.yearlyFee ?? "",
    },
    resolver: zodResolver(
      z.object({
        yearlyFee: z.bigint().superRefine((value, ctx) => {
          if (value > parseEther("200")) {
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Fee must be lower than 200 ETH",
            });
          }
          if (isPrivate && value === parseEther("0")) return;

          if (value === parseEther("0"))
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Fee cannot be set to 0 while operator status is set to public. To set the fee to 0, switch the operator status to private in the previous step.`,
            });

          if (value >= parseEther("0") && value < minimumFee)
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Fee must be greater than ${formatUnits(minimumFee, 18)} ETH`,
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
            description="The SSV network now supports operator fees denominated in ETH. This allows stakers to fund their clusters in ETH and pay operators directly in the network’s native asset."
          />
          <Text variant="body-2-medium">
            Operators set their own fees, denominated in ETH, to be charged per
            validator that selects them as one of their operators. This rate
            represents the cost for a standard 32 ETH validator. Actual fees are
            calculated dynamically based on the Effective Balance of the
            validators you manage. Fees are presented as annual payments, but in
            practice are streamed continuously as an ongoing process - per each
            passed block.
          </Text>
          <Text variant="body-2-medium">
            Your earnings are paid to your operator ETH balance, and can be
            withdrawn to your wallet at any time.
          </Text>
          <Text variant="body-2-medium">
            Please note that you can adjust your fee later (according to the{" "}
            <Button
              as="a"
              href="https://docs.ssv.network/operators/operator-onboarding/update-fee"
              target="_blank"
              variant="link"
            >
              limitations
            </Button>
            ) to align with market dynamics, competitiveness, or changes in ETH
            pricing.
          </Text>

          <FormField
            control={form.control}
            name="yearlyFee"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Annual fee</FormLabel>
                <FormControl>
                  <BigNumberInput
                    displayDecimals={7}
                    id="register-operator-fee"
                    value={field.value}
                    onChange={field.onChange}
                    max={parseEther("200")}
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
                  ~$757.5
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
